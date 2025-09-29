"use client"

import { BookOpen, Archive, Pin, TrendingUp } from "lucide-react"

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Notes",
      value: stats.overview.total || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Notes",
      value: (stats.overview.total || 0) - (stats.overview.archived || 0),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pinned",
      value: stats.overview.pinned || 0,
      icon: Pin,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Archived",
      value: stats.overview.archived || 0,
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${card.bgColor} mr-3`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards
