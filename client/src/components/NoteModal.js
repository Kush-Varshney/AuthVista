"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Save } from "lucide-react"
import LoadingSpinner from "./LoadingSpinner"
import api from "../utils/api"

const NoteModal = ({ isOpen, onClose, note, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // Reset form when modal opens/closes or note changes
  useEffect(() => {
    if (isOpen) {
      if (note) {
        reset({
          title: note.title,
          content: note.content,
          category: note.category,
          priority: note.priority,
        })
        setTags(note.tags ? note.tags.join(", ") : "")
      } else {
        reset({
          title: "",
          content: "",
          category: "other",
          priority: "medium",
        })
        setTags("")
      }
    }
  }, [isOpen, note, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Process tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const noteData = {
        ...data,
        tags: tagArray,
      }

      let response
      if (note) {
        // Update existing note
        response = await api.put(`/notes/${note._id}`, noteData)
      } else {
        // Create new note
        response = await api.post("/notes", noteData)
      }

      onSave(response.data.data)
      onClose()
    } catch (error) {
      console.error("Failed to save note:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{note ? "Edit Note" : "Create New Note"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              className={`input w-full ${errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Enter note title"
              {...register("title", {
                required: "Title is required",
                maxLength: {
                  value: 100,
                  message: "Title cannot exceed 100 characters",
                },
              })}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              rows={8}
              className={`textarea w-full ${errors.content ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              placeholder="Write your note content here..."
              {...register("content", {
                required: "Content is required",
                maxLength: {
                  value: 5001,
                  message: "Content cannot exceed 5001 characters",
                },
              })}
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select id="category" className="select w-full" {...register("category")}>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="ideas">Ideas</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select id="priority" className="select w-full" {...register("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              className="input w-full"
              placeholder="Enter tags separated by commas (e.g., work, important, project)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary flex items-center"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {note ? "Update Note" : "Create Note"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteModal
