import { validationResult } from "express-validator"
import User from "../models/User.js"
import Note from "../models/Note.js"
import { asyncHandler } from "../middlewares/errorHandler.js"

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  // Get user stats
  const noteCount = await Note.countDocuments({ user: req.user.id })
  const archivedCount = await Note.countDocuments({ user: req.user.id, isArchived: true })

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: {
      ...user.toObject(),
      stats: {
        totalNotes: noteCount,
        archivedNotes: archivedCount,
        activeNotes: noteCount - archivedCount,
      },
    },
  })
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  const fieldsToUpdate = {}
  const allowedFields = ["name", "email", "bio", "avatar"]

  // Only update fields that are provided
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      fieldsToUpdate[field] = req.body[field]
    }
  })

  // Check if email is being updated and if it already exists
  if (fieldsToUpdate.email) {
    const existingUser = await User.findOne({
      email: fieldsToUpdate.email,
      _id: { $ne: req.user.id },
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      })
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  })
})

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  // Delete all user's notes
  await Note.deleteMany({ user: req.user.id })

  // Delete user account
  await User.findByIdAndDelete(req.user.id)

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
    data: {},
  })
})

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit

  const total = await User.countDocuments()
  const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(limit).skip(startIndex)

  // Pagination result
  const pagination = {}

  if (startIndex + limit < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    message: "Users retrieved successfully",
    count: users.length,
    total,
    pagination,
    data: users,
  })
})
