import { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface Contest {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'ended'
  prize?: string
}

export default function MapPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContests()
  }, [])

  const loadContests = async () => {
    try {
      const data = await api.contests.getAll()
      setContests(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading contests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'text-green-400'
    if (status === 'upcoming') return 'text-blue-400'
    return 'text-muted'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-neon">
        <h1 className="text-2xl font-bold mb-2">🗺️ Design Map</h1>
        <p className="text-muted">
          Explore design challenges, contests, and learning paths.
        </p>
      </div>

      {contests.length === 0 ? (
        <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-bold mb-2">No Active Contests</h3>
          <p className="text-muted">
            Check back soon for new design challenges!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contests.map((contest) => (
            <div
              key={contest._id}
              className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6 hover:shadow-neon transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">
                    {contest.title}
                  </h3>
                  <p className="text-sm text-muted mb-2">{contest.description}</p>
                  <div className="flex gap-3 text-xs text-muted">
                    <span>Start: {new Date(contest.startDate).toLocaleDateString('mn-MN')}</span>
                    <span>·</span>
                    <span>End: {new Date(contest.endDate).toLocaleDateString('mn-MN')}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 bg-panel-2/60 border border-border rounded-full text-xs font-medium ${getStatusColor(contest.status)}`}>
                  {contest.status.toUpperCase()}
                </div>
              </div>

              {contest.prize && (
                <div className="mt-3 px-3 py-2 bg-gradient-to-r from-accent/10 to-accent-b/10 border border-accent/30 rounded-lg">
                  <span className="text-sm text-accent-c font-medium">🏆 Prize: {contest.prize}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
