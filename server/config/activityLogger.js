import winston from "winston"
import path from "path"
import DailyRotateFile from "winston-daily-rotate-file"

// Create activity logger specifically for user actions
const activityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "user-activity" },
  transports: [
    // Activity log file - separate from general server logs
    new DailyRotateFile({
      filename: path.join(process.cwd(), "logs", "activity-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
})

// Helper function to log user activities
export const logUserActivity = (action, userId, userEmail, details = {}, req = null) => {
  const logData = {
    action,
    userId,
    userEmail,
    details,
    timestamp: new Date().toISOString(),
    ip: req?.ip || "unknown",
    userAgent: req?.get("User-Agent") || "unknown",
  }

  activityLogger.info("User Activity", logData)
}

export default activityLogger
