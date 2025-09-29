import express from "express"
import { body } from "express-validator"
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  toggleArchive,
  togglePin,
  bulkDelete,
  getNoteStats,
} from "../controllers/notes.js"
import { protect } from "../middlewares/auth.js"

const router = express.Router()

// Validation rules
const noteValidation = [
  body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
  body("content").trim().isLength({ min: 1, max: 5001 }).withMessage("Content must be between 1 and 5001 characters"),
  body("category").optional().isIn(["personal", "work", "study", "ideas", "other"]).withMessage("Invalid category"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Each tag must be between 1 and 20 characters"),
]

const updateNoteValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 1, max: 5001 })
    .withMessage("Content must be between 1 and 5001 characters"),
  body("category").optional().isIn(["personal", "work", "study", "ideas", "other"]).withMessage("Invalid category"),
  body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Each tag must be between 1 and 20 characters"),
]

// All routes are protected
router.use(protect)

// Main CRUD routes
router.route("/").get(getNotes).post(noteValidation, createNote)

router.route("/:id").get(getNote).put(updateNoteValidation, updateNote).delete(deleteNote)

// Special routes
router.get("/search/query", searchNotes)
router.get("/stats/overview", getNoteStats)
router.patch("/:id/archive", toggleArchive)
router.patch("/:id/pin", togglePin)
router.delete("/bulk/delete", bulkDelete)

export default router
