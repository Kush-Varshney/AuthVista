import { validationResult } from "express-validator"
import User from "../models/User.js"
import { asyncHandler } from "../middlewares/errorHandler.js"

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  const { name, email, password } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    })
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  })

  // Generate token and send response
  sendTokenResponse(user, 201, res, "User registered successfully")
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  const { email, password } = req.body

  // Check for user
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    })
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    })
  }

  // Update last login
  await user.updateLastLogin()

  // Generate token and send response
  sendTokenResponse(user, 200, res, "Login successful")
})

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
    data: {},
  })
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  })
})

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "There is no user with that email",
    })
  }

  // For now, just return success (in production, you'd send an email)
  res.status(200).json({
    success: true,
    message: "Password reset email sent (feature not implemented yet)",
  })
})

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  // This is a placeholder - in production you'd verify the reset token
  res.status(200).json({
    success: true,
    message: "Password reset successful (feature not fully implemented)",
  })
})

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  const user = await User.findById(req.user.id).select("+password")

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    })
  }

  user.password = req.body.password
  await user.save()

  sendTokenResponse(user, 200, res, "Password updated successfully")
})

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken()

  // Remove password from output
  user.password = undefined

  res.status(statusCode).json({
    success: true,
    message,
    token,
    data: user,
  })
}
