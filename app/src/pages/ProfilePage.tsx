import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../lib/api'

interface UserProfile {
  _id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  totalPoints?: number
  postsCount?: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const data = await api.auth.getMe(token)
      setProfile(data)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankTitle = (points: number) => {
    if (points >= 200) return 'Aether Painter 🌟'
    if (points >= 100) return 'Glyph Crafter ✨'
    if (points >= 50) return 'Pixel Artist 💫'
    return 'Novice Spark ✨'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted">Loading profile...</div>
      </div>
    )
  }

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User'
  const displayEmail = profile?.email || user?.email || ''
  const totalPoints = profile?.totalPoints || 0
  const postsCount = profile?.postsCount || 0

  return (
    <div className="space-y-6">
      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-neon">
        <h1 className="text-2xl font-bold mb-2">👤 Profile</h1>
        <p className="text-muted">
          Manage your account and view your progress.
        </p>
      </div>

      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-neon shadow-neon flex items-center justify-center text-white text-3xl font-bold">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={displayName} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink mb-1">{displayName}</h2>
            <p className="text-muted text-sm mb-3">{displayEmail}</p>
            {profile?.bio && (
              <p className="text-sm text-ink mb-3">{profile.bio}</p>
            )}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-panel-2/60 border border-border rounded-full text-sm">
              <span className="text-muted">Role:</span>
              <span className="text-ink font-medium">
                {profile?.role || 'student'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted">Total Points</span>
              <span className="font-bold text-accent-c">{totalPoints} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Posts</span>
              <span className="font-bold">{postsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Rank</span>
              <span className="font-bold">{getRankTitle(totalPoints)}</span>
            </div>
          </div>
        </div>

        <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Achievements</h3>
          <p className="text-muted text-sm">
            {totalPoints > 0 ? `Great work! You have ${totalPoints} points!` : 'No achievements yet. Start posting!'}
          </p>
        </div>
      </div>
    </div>
  )
}
