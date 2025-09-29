"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Plus, Search, Filter, Grid, List } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import NoteCard from "../components/NoteCard"
import NoteModal from "../components/NoteModal"
import SearchFilters from "../components/SearchFilters"
import StatsCards from "../components/StatsCards"
import api from "../utils/api"
import toast from "react-hot-toast"

const Dashboard = () => {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
    archived: false,
    pinned: false,
  })
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    hasMore: false,
  })

  // Fetch notes
  const fetchNotes = async (page = 1, reset = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      })

      if (searchQuery.trim()) {
        params.append("q", searchQuery.trim())
      }

      const endpoint = searchQuery.trim() ? "/notes/search/query" : "/notes"
      const response = await api.get(`${endpoint}?${params}`)

      const newNotes = response.data.data
      setNotes(reset || page === 1 ? newNotes : [...notes, ...newNotes])
      setPagination({
        page,
        limit: pagination.limit,
        total: response.data.total,
        hasMore: response.data.pagination?.next ? true : false,
      })
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      toast.error("Failed to load notes")
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await api.get("/notes/stats/overview")
      setStats(response.data.data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  // Initial load
  useEffect(() => {
    fetchNotes(1, true)
    fetchStats()
  }, [searchQuery, filters])

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // Handle filters
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // Handle note actions
  const handleNoteCreate = (newNote) => {
    setNotes([newNote, ...notes])
    fetchStats()
    toast.success("Note created successfully!")
  }

  const handleNoteUpdate = (updatedNote) => {
    setNotes(notes.map((note) => (note._id === updatedNote._id ? updatedNote : note)))
    fetchStats()
    toast.success("Note updated successfully!")
  }

  const handleNoteDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`)
      setNotes(notes.filter((note) => note._id !== noteId))
      fetchStats()
      toast.success("Note deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete note")
    }
  }

  const handleNoteToggle = async (noteId, action) => {
    try {
      const response = await api.patch(`/notes/${noteId}/${action}`)
      const updatedNote = response.data.data
      setNotes(notes.map((note) => (note._id === noteId ? updatedNote : note)))
      fetchStats()
    } catch (error) {
      toast.error(`Failed to ${action} note`)
    }
  }

  // Load more notes
  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchNotes(pagination.page + 1, false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Manage your notes and stay organized</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </button>
        </div>

        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* View Toggle and Filter Button */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-primary-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline ${showFilters ? "bg-primary-50 border-primary-300" : ""}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />}
      </div>

      {/* Notes Grid/List */}
      {loading && notes.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || Object.values(filters).some((f) => f !== "all" && f !== false)
                  ? "Try adjusting your search or filters"
                  : "Get started by creating your first note"}
              </p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                viewMode={viewMode}
                onEdit={(note) => {
                  setSelectedNote(note)
                  setIsModalOpen(true)
                }}
                onDelete={handleNoteDelete}
                onTogglePin={(noteId) => handleNoteToggle(noteId, "pin")}
                onToggleArchive={(noteId) => handleNoteToggle(noteId, "archive")}
              />
            ))}
          </div>

          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="text-center mt-8">
              <button onClick={loadMore} disabled={loading} className="btn-outline">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedNote(null)
        }}
        note={selectedNote}
        onSave={selectedNote ? handleNoteUpdate : handleNoteCreate}
      />
    </div>
  )
}

export default Dashboard
