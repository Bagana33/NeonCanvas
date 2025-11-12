import { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface User {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  totalPoints?: number
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const data = await api.users.getLeaderboard(20)
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankEmoji = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return '🏅'
  }

  const getRankTitle = (points: number) => {
    if (points >= 200) return 'Aether Painter'
    if (points >= 100) return 'Glyph Crafter'
    if (points >= 50) return 'Pixel Artist'
    return 'Novice Spark'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-neon">
        <h1 className="text-2xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-muted">
          Top designers ranked by points and achievements.
        </p>
      </div>

      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-12 text-center">
            <p className="text-muted">No users yet.</p>
          </div>
        ) : (
          users.map((user, index) => {
            const points = user.totalPoints || 0
            const initials = user.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <div
                key={user._id}
                className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-4 flex items-center justify-between hover:shadow-neon transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-panel-2 to-border flex items-center justify-center font-bold text-sm">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-ink">{user.name}</div>
                    <div className="text-sm text-muted">{getRankTitle(points)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-4 py-1 bg-gradient-to-r from-accent-c to-accent rounded-full text-white font-bold text-sm shadow-neon">
                    {points} pts
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {getRankEmoji(index)} #{index + 1}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
