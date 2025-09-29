"use client"

const SearchFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      category: "all",
      priority: "all",
      archived: false,
      pinned: false,
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "all" && value !== false)

  return (
    <div className="card bg-gray-50">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="select text-sm"
          >
            <option value="all">All Categories</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="ideas">Ideas</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="select text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.pinned}
              onChange={(e) => handleFilterChange("pinned", e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700">Pinned only</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.archived}
              onChange={(e) => handleFilterChange("archived", e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-gray-700">Archived only</span>
          </label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchFilters
