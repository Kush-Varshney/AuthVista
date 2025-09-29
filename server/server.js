import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import connectDB from "./config/database.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import noteRoutes from "./routes/notes.js"
import logger from "./config/logger.js"
import { requestLogger, errorLogger } from "./middlewares/requestLogger.js"
import activityLogger from "./config/activityLogger.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

logger.info("Starting Notes App Server...", {
  port: PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  timestamp: new Date().toISOString(),
})

activityLogger.info("User Activity Logging System Initialized", {
  timestamp: new Date().toISOString(),
  logLocation: "logs/activity-*.log",
})

connectDB()

app.use(requestLogger)

app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increase to 200 requests per 15 minutes per IP
  message: "Too many requests from this IP, please try again later.",
  onLimitReached: (req) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    })
  },
})
app.use(limiter)

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/notes", noteRoutes)

app.get("/api/health", (req, res) => {
  logger.info("Health check requested", {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })

  res.status(200).json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  })
})

app.use(errorLogger)

app.use("*", (req, res) => {
  logger.warn("Route not found", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  })

  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  logger.info(`Server successfully started on port ${PORT}`, {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    timestamp: new Date().toISOString(),
  })
  activityLogger.info("Server started - User activity logging active", {
    port: PORT,
    timestamp: new Date().toISOString(),
  })
  console.log(`Server running on port ${PORT}`)
})

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
})

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully")
  process.exit(0)
})

export default app
