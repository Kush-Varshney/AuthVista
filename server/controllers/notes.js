import { validationResult } from "express-validator"
import Note from "../models/Note.js"
import mongoose from "mongoose"
import { asyncHandler } from "../middlewares/errorHandler.js"

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  // Query parameters
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit

  // Filter parameters
  const filter = { user: req.user.id }

  if (req.query.category && req.query.category !== "all") {
    filter.category = req.query.category
  }

  if (req.query.priority && req.query.priority !== "all") {
    filter.priority = req.query.priority
  }

  if (req.query.archived !== undefined) {
    filter.isArchived = req.query.archived === "true"
  }

  if (req.query.pinned !== undefined) {
    filter.isPinned = req.query.pinned === "true"
  }

  if (req.query.tags) {
    const tags = req.query.tags.split(",").map((tag) => tag.trim())
    filter.tags = { $in: tags }
  }

  // Sort parameters
  let sortBy = { createdAt: -1 } // Default sort

  if (req.query.sortBy) {
    const sortField = req.query.sortBy
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1

    if (["title", "createdAt", "updatedAt", "priority"].includes(sortField)) {
      sortBy = { [sortField]: sortOrder }
    }
  }

  // If pinned notes are requested, sort by pinned first
  if (req.query.pinned !== "false") {
    sortBy = { isPinned: -1, ...sortBy }
  }

  // Execute query
  const total = await Note.countDocuments(filter)
  const notes = await Note.find(filter).sort(sortBy).limit(limit).skip(startIndex)

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
    message: "Notes retrieved successfully",
    count: notes.length,
    total,
    pagination,
    data: notes,
  })
})

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    })
  }

  res.status(200).json({
    success: true,
    message: "Note retrieved successfully",
    data: note,
  })
})

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  // Add user to req.body
  req.body.user = req.user.id

  // Clean tags array
  if (req.body.tags) {
    req.body.tags = req.body.tags.filter((tag) => tag.trim() !== "").map((tag) => tag.trim().toLowerCase())
  }

  const note = await Note.create(req.body)

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: note,
  })
})

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }

  let note = await Note.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    })
  }

  // Clean tags array if provided
  if (req.body.tags) {
    req.body.tags = req.body.tags.filter((tag) => tag.trim() !== "").map((tag) => tag.trim().toLowerCase())
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    data: note,
  })
})

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    })
  }

  await Note.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
    data: {},
  })
})

// @desc    Search notes
// @route   GET /api/notes/search/query
// @access  Private
export const searchNotes = asyncHandler(async (req, res) => {
  const { q, category, priority, tags, archived } = req.query
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit

  // Build search query
  const searchQuery = { user: req.user.id }

  // Text search
  if (q && q.trim() !== "") {
    searchQuery.$text = { $search: q.trim() }
  }

  // Additional filters
  if (category && category !== "all") {
    searchQuery.category = category
  }

  if (priority && priority !== "all") {
    searchQuery.priority = priority
  }

  if (archived !== undefined) {
    searchQuery.isArchived = archived === "true"
  }

  if (tags) {
    const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase())
    searchQuery.tags = { $in: tagArray }
  }

  // Execute search
  const total = await Note.countDocuments(searchQuery)
  let notes

  if (q && q.trim() !== "") {
    // If text search, sort by text score
    notes = await Note.find(searchQuery, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" }, isPinned: -1 })
      .limit(limit)
      .skip(startIndex)
  } else {
    // Regular sort
    notes = await Note.find(searchQuery).sort({ isPinned: -1, createdAt: -1 }).limit(limit).skip(startIndex)
  }

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
    message: "Search completed successfully",
    count: notes.length,
    total,
    pagination,
    data: notes,
  })
})

// @desc    Toggle archive status
// @route   PATCH /api/notes/:id/archive
// @access  Private
export const toggleArchive = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    })
  }

  note.isArchived = !note.isArchived
  await note.save()

  res.status(200).json({
    success: true,
    message: `Note ${note.isArchived ? "archived" : "unarchived"} successfully`,
    data: note,
  })
})

// @desc    Toggle pin status
// @route   PATCH /api/notes/:id/pin
// @access  Private
export const togglePin = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user.id,
  })

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    })
  }

  note.isPinned = !note.isPinned
  await note.save()

  res.status(200).json({
    success: true,
    message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
    data: note,
  })
})

// @desc    Bulk delete notes
// @route   DELETE /api/notes/bulk/delete
// @access  Private
export const bulkDelete = asyncHandler(async (req, res) => {
  const { noteIds } = req.body

  if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of note IDs",
    })
  }

  // Delete notes that belong to the user
  const result = await Note.deleteMany({
    _id: { $in: noteIds },
    user: req.user.id,
  })

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} notes deleted successfully`,
    data: { deletedCount: result.deletedCount },
  })
})

// @desc    Get note statistics
// @route   GET /api/notes/stats/overview
// @access  Private
export const getNoteStats = asyncHandler(async (req, res) => {
  const userId = req.user.id

  const userObjectId = new mongoose.Types.ObjectId(userId)

  // Aggregate statistics
  const stats = await Note.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        archived: { $sum: { $cond: ["$isArchived", 1, 0] } },
        pinned: { $sum: { $cond: ["$isPinned", 1, 0] } },
        byCategory: {
          $push: {
            category: "$category",
            priority: "$priority",
          },
        },
      },
    },
  ])

  // Category breakdown
  const categoryStats = await Note.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ])

  // Priority breakdown
  const priorityStats = await Note.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ])

  // Recent activity (notes created in last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentCount = await Note.countDocuments({
    user: userObjectId,
    createdAt: { $gte: sevenDaysAgo },
  })

  const result = {
    overview: stats[0] || { total: 0, archived: 0, pinned: 0 },
    categories: categoryStats.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {}),
    priorities: priorityStats.reduce((acc, item) => {
      acc[item._id] = item.count
      return acc
    }, {}),
    recentActivity: recentCount,
  }

  res.status(200).json({
    success: true,
    message: "Statistics retrieved successfully",
    data: result,
  })
})
