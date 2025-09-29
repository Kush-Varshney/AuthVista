"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { BookOpen, Shield, Search, Smartphone, Users, Zap } from "lucide-react"

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: BookOpen,
      title: "Organize Your Thoughts",
      description: "Create, edit, and organize your notes with categories, tags, and priorities.",
    },
    {
      icon: Search,
      title: "Powerful Search",
      description: "Find any note instantly with our advanced search and filtering capabilities.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your notes are protected with industry-standard security and encryption.",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Access your notes from any device with our mobile-friendly interface.",
    },
    {
      icon: Users,
      title: "User Management",
      description: "Secure user authentication with profile management and customization.",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Built with modern technologies for optimal performance and reliability.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Your Digital
            <span className="text-primary-600"> Notebook</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-balance">
            Capture, organize, and find your thoughts effortlessly. A modern note-taking app built for productivity and
            simplicity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-outline text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to stay organized</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you capture ideas, organize thoughts, and boost your productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <feature.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to get organized?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who have transformed their note-taking experience.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Start Taking Notes Today
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
