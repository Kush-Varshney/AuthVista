"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../contexts/AuthContext"
import { User, Mail, Calendar, Edit, Save, X } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import api from "../utils/api"
import toast from "react-hot-toast"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  // Fetch user profile and stats
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileResponse, statsResponse] = await Promise.all([
          api.get("/users/profile"),
          api.get("/notes/stats/overview"),
        ])

        setStats(statsResponse.data.data)
        reset({
          name: profileResponse.data.data.name,
          email: profileResponse.data.data.email,
          bio: profileResponse.data.data.bio || "",
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [reset])

  const onSubmit = async (data) => {
    const result = await updateUser(data)
    if (result.success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    reset({
      name: user.name,
      email: user.email,
      bio: user.bio || "",
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    disabled={!isEditing}
                    className={`input pl-10 w-full ${!isEditing ? "bg-gray-50" : ""} ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name cannot exceed 50 characters",
                      },
                    })}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    disabled={!isEditing}
                    className={`input pl-10 w-full ${!isEditing ? "bg-gray-50" : ""} ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  disabled={!isEditing}
                  className={`textarea w-full ${!isEditing ? "bg-gray-50" : ""} ${errors.bio ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Tell us about yourself..."
                  {...register("bio", {
                    maxLength: {
                      value: 500,
                      message: "Bio cannot exceed 500 characters",
                    },
                  })}
                />
                {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex items-center gap-3">
                  <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center">
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button type="button" onClick={handleCancel} className="btn-outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Profile Stats and Info */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Role: {user.role}</span>
              </div>
            </div>
          </div>

          {/* Notes Statistics */}
          {stats && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Notes</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Notes</span>
                  <span className="font-semibold text-gray-900">{stats.overview.total || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Notes</span>
                  <span className="font-semibold text-gray-900">
                    {(stats.overview.total || 0) - (stats.overview.archived || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pinned Notes</span>
                  <span className="font-semibold text-gray-900">{stats.overview.pinned || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Archived Notes</span>
                  <span className="font-semibold text-gray-900">{stats.overview.archived || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recent Activity</span>
                  <span className="font-semibold text-gray-900">{stats.recentActivity || 0} this week</span>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {stats && stats.categories && Object.keys(stats.categories).length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes by Category</h3>
              <div className="space-y-2">
                {Object.entries(stats.categories).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{category}</span>
                    <span className="font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
