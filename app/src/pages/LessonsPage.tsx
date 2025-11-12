import { useEffect, useState } from 'react'
import { api } from '../lib/api'

interface Lesson {
  _id: string
  title: string
  subject: string
  grade: string
  teacher: {
    name: string
  }
  questions: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLessons()
  }, [])

  const loadLessons = async () => {
    try {
      const data = await api.lessons.getAll({})
      setLessons(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted">Loading lessons...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-3xl p-6 shadow-neon">
        <h1 className="text-2xl font-bold mb-2">📚 Lessons</h1>
        <p className="text-muted">
          Learn new skills and complete quizzes to earn points.
        </p>
      </div>

      <div className="grid gap-4">
        {lessons.length === 0 ? (
          <div className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-12 text-center">
            <p className="text-muted">No lessons available yet.</p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-panel/70 backdrop-blur-xl border border-border rounded-2xl p-6 hover:shadow-neon transition-all hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">
                    {lesson.title}
                  </h3>
                  <div className="flex gap-3 text-sm text-muted">
                    <span>{lesson.subject}</span>
                    <span>·</span>
                    <span>Grade: {lesson.grade}</span>
                    <span>·</span>
                    <span>{lesson.teacher?.name || 'Unknown'}</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-panel-2/60 border border-border rounded-full text-xs text-muted">
                  {lesson.questions?.length || 0} questions
                </div>
              </div>

              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-accent to-accent-b text-white font-semibold rounded-full hover:shadow-neon transition-all hover:-translate-y-0.5">
                Start Lesson
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
