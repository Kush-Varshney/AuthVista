import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns"

/**
 * Format date for display
 */
export const formatDate = (date, options = {}) => {
  const dateObj = new Date(date)

  if (options.relative) {
    if (isToday(dateObj)) {
      return `Today at ${format(dateObj, "h:mm a")}`
    }
    if (isYesterday(dateObj)) {
      return `Yesterday at ${format(dateObj, "h:mm a")}`
    }
    return formatDistanceToNow(dateObj, { addSuffix: true })
  }

  if (options.short) {
    return format(dateObj, "MMM d, yyyy")
  }

  return format(dateObj, "MMMM d, yyyy 'at' h:mm a")
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Generate initials from name
 */
export const getInitials = (name) => {
  if (!name) return "U"
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate random color for avatars
 */
export const getRandomColor = (seed) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]
  const index = seed ? seed.length % colors.length : Math.floor(Math.random() * colors.length)
  return colors[index]
}

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map((item) => deepClone(item))
  if (typeof obj === "object") {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Generate slug from text
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (obj == null) return true
  if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0
  return Object.keys(obj).length === 0
}

/**
 * Sort array of objects by key
 */
export const sortBy = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })
}

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

/**
 * Get contrast color (black or white) for background
 */
export const getContrastColor = (hexColor) => {
  // Remove # if present
  const color = hexColor.replace("#", "")

  // Convert to RGB
  const r = Number.parseInt(color.substr(0, 2), 16)
  const g = Number.parseInt(color.substr(2, 2), 16)
  const b = Number.parseInt(color.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? "#000000" : "#ffffff"
}
