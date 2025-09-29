import express from "express"
import { body } from "express-validator"
import { register, login, logout, getMe, forgotPassword, resetPassword, updatePassword } from "../controllers/auth.js"
import { protect } from "../middlewares/auth.js"

const router = express.Router()

// Validation rules
const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

const passwordValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
]

const updatePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain at least one uppercase letter, one lowercase letter, and one number"),
]

// Public routes
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.post("/logout", logout)
router.post("/forgot-password", [body("email").isEmail().normalizeEmail()], forgotPassword)
router.put("/reset-password/:resettoken", passwordValidation, resetPassword)

// Protected routes
router.get("/me", protect, getMe)
router.put("/update-password", protect, updatePasswordValidation, updatePassword)

export default router
