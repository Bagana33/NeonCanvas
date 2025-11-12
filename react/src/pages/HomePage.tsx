import React from 'react'

export default function HomePage() {
  return (
    <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
      <div className="card"><h2>Feed (Coming)</h2><p>Posts, reactions and notifications will appear here after migration.</p></div>
      <div className="card"><h2>Contests (Coming)</h2><p>Contest listing and management will be ported soon.</p></div>
      <div className="card"><h2>Lessons Preview</h2><p>Access full lessons under the Lessons tab to view quiz & character image.</p></div>
    </div>
  )
}
