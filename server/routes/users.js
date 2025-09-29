import express from "express"
import { body } from "express-validator"
import { getProfile, updateProfile, deleteAccount, getAllUsers } from "../controllers/users.js"
import { protect, authorize } from "../middlewares/auth.js"

const router = express.Router()

// Validation rules
const updateProfileValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").optional().isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("bio").optional().isLength({ max: 500 }).withMessage("Bio cannot be more than 500 characters"),
]

// All routes are protected
router.use(protect)

// User profile routes
router.get("/profile", getProfile)
router.put("/profile", updateProfileValidation, updateProfile)
router.delete("/account", deleteAccount)

// Admin only routes
router.get("/", authorize("admin"), getAllUsers)

export default router
