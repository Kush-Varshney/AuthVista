import { logUserActivity } from "../config/activityLogger.js"

const recentLogs = new Map()
const DUPLICATE_WINDOW = 1000 // 1 second window to prevent duplicates

// Helper function to create a unique key for deduplication
const createLogKey = (userId, action, details) => {
  return `${userId}-${action}-${JSON.stringify(details)}`
}

// Helper function to check if this is a duplicate log
const isDuplicateLog = (key) => {
  const now = Date.now()
  const lastLog = recentLogs.get(key)

  if (lastLog && now - lastLog < DUPLICATE_WINDOW) {
    return true
  }

  recentLogs.set(key, now)

  // Clean up old entries periodically
  if (recentLogs.size > 1000) {
    const cutoff = now - DUPLICATE_WINDOW
    for (const [k, timestamp] of recentLogs.entries()) {
      if (timestamp < cutoff) {
        recentLogs.delete(k)
      }
    }
  }

  return false
}

// Middleware to automatically log user activities
export const logActivity = (action, getDetails = () => ({})) => {
  return (req, res, next) => {
    // Store original res.json to intercept successful responses
    const originalJson = res.json

    res.json = function (data) {
      // Only log if the response is successful (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const user = req.user
        if (user) {
          const details = typeof getDetails === "function" ? getDetails(req, res, data) : getDetails

          const logKey = createLogKey(user._id, action, details)
          if (!isDuplicateLog(logKey)) {
            logUserActivity(action, user._id, user.email, details, req)
          }
        }
      }

      // Call original json method
      return originalJson.call(this, data)
    }

    next()
  }
}

// Specific activity loggers for different actions
export const logAuthActivity = (action) => {
  return logActivity(action, (req, res, data) => ({
    success: res.statusCode < 400,
    ...(action === "LOGIN" && { loginMethod: "email" }),
    ...(action === "REGISTER" && {
      userName: data?.data?.name,
      userRole: data?.data?.role || "user",
    }),
  }))
}

export const logNoteActivity = (action) => {
  return logActivity(action, (req, res, data) => ({
    noteId: req.params?.id || data?.data?._id,
    noteTitle: data?.data?.title || req.body?.title,
    category: data?.data?.category || req.body?.category,
    ...(action === "BULK_DELETE_NOTES" && {
      deletedCount: data?.deletedCount || req.body?.noteIds?.length,
    }),
    ...(action === "SEARCH_NOTES" && {
      searchQuery: req.query?.q,
      resultsCount: data?.data?.length,
    }),
  }))
}

export const logProfileActivity = (action) => {
  return logActivity(action, (req, res, data) => ({
    updatedFields: Object.keys(req.body || {}),
    ...(action === "DELETE_ACCOUNT" && {
      accountDeleted: true,
      deletionReason: req.body?.reason,
    }),
  }))
}
