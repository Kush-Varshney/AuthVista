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
import { logNoteActivity } from "../middlewares/activityLogger.js"

const router = express.Router()

// Validation rules
const noteValidation = [
  body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
  body("content").trim().isLength({ min: 1, max: 5000 }).withMessage("Content must be between 1 and 5000 characters"),
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
    .isLength({ min: 1, max: 5000 })
    .withMessage("Content must be between 1 and 5000 characters"),
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
router
  .route("/")
  .get(logNoteActivity("VIEW_NOTES"), getNotes)
  .post(noteValidation, logNoteActivity("CREATE_NOTE"), createNote)

router
  .route("/:id")
  .get(logNoteActivity("VIEW_NOTE"), getNote)
  .put(updateNoteValidation, logNoteActivity("UPDATE_NOTE"), updateNote)
  .delete(logNoteActivity("DELETE_NOTE"), deleteNote)

// Special routes
router.get("/search/query", logNoteActivity("SEARCH_NOTES"), searchNotes)
router.get("/stats/overview", logNoteActivity("VIEW_STATS"), getNoteStats)
router.patch("/:id/archive", logNoteActivity("TOGGLE_ARCHIVE"), toggleArchive)
router.patch("/:id/pin", logNoteActivity("TOGGLE_PIN"), togglePin)
router.delete("/bulk/delete", logNoteActivity("BULK_DELETE_NOTES"), bulkDelete)

export default router
