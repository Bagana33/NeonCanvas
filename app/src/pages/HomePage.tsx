import { useEffect, useState } from 'react'
import { API_URL } from '../lib/api'

interface Post {
  _id: string
  title: string
  description: string
  image?: string
  reactions?: Record<string, number>
  userId?: {
    name: string
    avatar: string
  }
  createdAt: string
  points?: number
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data || [])
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calcPoints = (reactions?: Record<string, number>) => {
    if (!reactions) return 0
    const points = { like: 1, love: 2, wow: 1.5, fire: 2.5, clap: 1 }
    let total = 0
    Object.entries(reactions).forEach(([key, value]) => {
      total += (points[key as keyof typeof points] || 1) * value
    })
    return Math.round(total * 10) / 10
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted">Loading posts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-neon">
        <h1 className="text-2xl font-bold mb-2">🎨 Welcome to NeonCanvas</h1>
        <p className="text-muted">
          Share your designs, get feedback, and level up your creative skills.
        </p>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-12 text-center">
            <p className="text-muted">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => {
            const points = post.points || calcPoints(post.reactions)

            return (
              <article
                key={post._id}
                className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6 hover:shadow-neon transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-ink mb-1">
                      {post.title || 'Untitled'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted">
                      {post.userId && (
                        <>
                          <span className="font-medium">{post.userId.name}</span>
                          <span>·</span>
                        </>
                      )}
                      <span>{new Date(post.createdAt).toLocaleDateString('mn-MN')}</span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-accent-c">
                    {points} pts
                  </div>
                </div>

                {post.description && (
                  <p className="text-muted mb-4">{post.description}</p>
                )}

                {post.image && (
                  <div className="rounded-xl overflow-hidden border border-border mb-4">
                    <img
                      src={post.image}
                      alt={post.title || 'Post image'}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  {['👍', '❤️', '😮', '🔥', '👏'].map((emoji, i) => {
                    const reactionKeys = ['like', 'love', 'wow', 'fire', 'clap']
                    const count = post.reactions?.[reactionKeys[i]] || 0
                    return (
                      <button
                        key={i}
                        className="px-3 py-1.5 bg-panel-2/60 border border-border rounded-full text-sm hover:-translate-y-0.5 transition-all"
                      >
                        <span className="mr-1">{emoji}</span>
                        <span className="text-muted">{count}</span>
                      </button>
                    )
                  })}
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
