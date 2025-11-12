import { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface DashboardStats {
  totalPosts: number
  activeUsers: number
  totalLessons: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    activeUsers: 0,
    totalLessons: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Fetch counts from different endpoints
      const [postsData, usersData, lessonsData] = await Promise.all([
        api.posts.getAll({}).catch(() => []),
        api.users.getLeaderboard(100).catch(() => []),
        api.lessons.getAll({}).catch(() => [])
      ])

      setStats({
        totalPosts: Array.isArray(postsData) ? postsData.length : 0,
        activeUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalLessons: Array.isArray(lessonsData) ? lessonsData.length : 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statItems = [
    { label: 'Total Posts', value: stats.totalPosts.toString(), color: 'accent' },
    { label: 'Active Users', value: stats.activeUsers.toString(), color: 'accent-b' },
    { label: 'Lessons', value: stats.totalLessons.toString(), color: 'accent-c' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-neon">
        <h1 className="text-2xl font-bold mb-2">📊 Dashboard</h1>
        <p className="text-muted">
          Analytics and insights for teachers and admins.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {statItems.map((stat, i) => (
          <div
            key={i}
            className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6"
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-accent to-accent-b bg-clip-text text-transparent">
              {loading ? '...' : stat.value}
            </div>
            <div className="text-sm text-muted mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        <p className="text-muted text-sm">No recent activity.</p>
      </div>
    </div>
  )
}
