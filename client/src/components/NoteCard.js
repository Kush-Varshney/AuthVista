"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Pin, Archive, Edit, Trash2, MoreVertical } from "lucide-react"

const NoteCard = ({ note, viewMode, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  const [showMenu, setShowMenu] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "work":
        return "bg-blue-100 text-blue-800"
      case "personal":
        return "bg-purple-100 text-purple-800"
      case "study":
        return "bg-indigo-100 text-indigo-800"
      case "ideas":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  if (viewMode === "list") {
    return (
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {note.isPinned && <Pin className="h-4 w-4 text-yellow-500 fill-current" />}
              <h3 className="text-lg font-semibold text-gray-900 truncate">{note.title}</h3>
              <span className={`badge ${getPriorityColor(note.priority)}`}>{note.priority}</span>
              <span className={`badge ${getCategoryColor(note.category)}`}>{note.category}</span>
            </div>
            <p className="text-gray-600 mb-3">{truncateContent(note.content, 200)}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>Updated {formatDistanceToNow(new Date(note.updatedAt))} ago</span>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="badge badge-secondary text-xs">
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative ml-4">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(note)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onTogglePin(note._id)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Pin className="h-4 w-4 mr-2" />
                    {note.isPinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    onClick={() => {
                      onToggleArchive(note._id)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    {note.isArchived ? "Unarchive" : "Archive"}
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this note?")) {
                        onDelete(note._id)
                      }
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {note.isPinned && <Pin className="h-4 w-4 text-yellow-500 fill-current" />}
          <span className={`badge ${getPriorityColor(note.priority)}`}>{note.priority}</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(note)
                    setShowMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onTogglePin(note._id)
                    setShowMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Pin className="h-4 w-4 mr-2" />
                  {note.isPinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => {
                    onToggleArchive(note._id)
                    setShowMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {note.isArchived ? "Unarchive" : "Archive"}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this note?")) {
                      onDelete(note._id)
                    }
                    setShowMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-3">{truncateContent(note.content)}</p>

      <div className="flex items-center justify-between text-sm">
        <span className={`badge ${getCategoryColor(note.category)}`}>{note.category}</span>
        <span className="text-gray-500">{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="badge badge-secondary text-xs">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>}
        </div>
      )}
    </div>
  )
}

export default NoteCard
