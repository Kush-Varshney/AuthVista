// API endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  UPDATE_PASSWORD: "/auth/update-password",

  // Users
  PROFILE: "/users/profile",
  DELETE_ACCOUNT: "/users/account",

  // Notes
  NOTES: "/notes",
  SEARCH_NOTES: "/notes/search/query",
  NOTE_STATS: "/notes/stats/overview",
  BULK_DELETE: "/notes/bulk/delete",
}

// Note categories
export const NOTE_CATEGORIES = [
  { value: "personal", label: "Personal", color: "purple" },
  { value: "work", label: "Work", color: "blue" },
  { value: "study", label: "Study", color: "indigo" },
  { value: "ideas", label: "Ideas", color: "pink" },
  { value: "other", label: "Other", color: "gray" },
]

// Note priorities
export const NOTE_PRIORITIES = [
  { value: "low", label: "Low", color: "green" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "high", label: "High", color: "red" },
]

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
}

// Validation rules
export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  NOTE: {
    TITLE_MAX_LENGTH: 100,
    CONTENT_MAX_LENGTH: 5001,
    TAG_MAX_LENGTH: 20,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
}

// Toast messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Login successful!",
    REGISTER: "Registration successful!",
    LOGOUT: "Logged out successfully",
    NOTE_CREATED: "Note created successfully!",
    NOTE_UPDATED: "Note updated successfully!",
    NOTE_DELETED: "Note deleted successfully!",
    PROFILE_UPDATED: "Profile updated successfully!",
  },
  ERROR: {
    LOGIN_FAILED: "Login failed",
    REGISTER_FAILED: "Registration failed",
    NETWORK_ERROR: "Network error. Please check your connection.",
    SERVER_ERROR: "Server error. Please try again later.",
    UNAUTHORIZED: "Session expired. Please login again.",
    FORBIDDEN: "Access forbidden",
    NOT_FOUND: "Resource not found",
    VALIDATION_ERROR: "Please check your input and try again",
  },
}

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
}
