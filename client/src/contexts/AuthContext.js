"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import api from "../utils/api"
import toast from "react-hot-toast"

const AuthContext = createContext()

const getInitialToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

const initialState = {
  user: null,
  token: getInitialToken(),
  loading: true,
  isAuthenticated: false,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "LOGIN_SUCCESS":
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token)
      }
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      }
    case "AUTH_ERROR":
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window === "undefined") {
        dispatch({ type: "SET_LOADING", payload: false })
        return
      }

      const token = localStorage.getItem("token")

      if (token) {
        try {
          const response = await api.get("/auth/me")
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: response.data.data,
              token,
            },
          })
        } catch (error) {
          console.error("Failed to load user:", error)
          dispatch({ type: "AUTH_ERROR" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await api.post("/auth/login", {
        email,
        password,
      })

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.data,
          token: response.data.token,
        },
      })

      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      dispatch({ type: "AUTH_ERROR" })
      return { success: false, message }
    }
  }

  // Register function
  const register = async (name, email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      })

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.data.data,
          token: response.data.token,
        },
      })

      toast.success("Registration successful!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      toast.error(message)
      dispatch({ type: "AUTH_ERROR" })
      return { success: false, message }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      dispatch({ type: "LOGOUT" })
      toast.success("Logged out successfully")
    }
  }

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await api.put("/users/profile", userData)
      dispatch({
        type: "UPDATE_USER",
        payload: response.data.data,
      })
      toast.success("Profile updated successfully!")
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Update failed"
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
