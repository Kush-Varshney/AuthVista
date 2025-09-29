import logger from "../config/logger.js"

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now()

  // Log request details
  logger.http("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
  })

  // Override res.end to log response details
  const originalEnd = res.end
  res.end = function (chunk, encoding) {
    const duration = Date.now() - start

    logger.http("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    })

    originalEnd.call(this, chunk, encoding)
  }

  next()
}

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error("Request error", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  })

  next(err)
}
