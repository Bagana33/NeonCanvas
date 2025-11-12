import React from 'react'

export default function LessonsPage() {
  return (
    <div className="grid" style={{gridTemplateColumns:'320px 1fr'}}>
      <div className="card">
        <h2>Lessons</h2>
        <p>We'll load lessons from localStorage with migration to lesson-character.jpg.</p>
      </div>
      <div className="card">
        <h2>Viewer</h2>
        <p>Image / files and quiz UI will appear here.</p>
      </div>
    </div>
  )
}
