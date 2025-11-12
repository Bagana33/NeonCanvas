import React from 'react'

export default function ProfilePage() {
  return (
    <div className="grid" style={{gridTemplateColumns:'320px 1fr'}}>
      <div className="card">
        <h2>Profile</h2>
        <div className="grid" style={{gridTemplateColumns:'1fr'}}>
          <label>
            <div style={{marginBottom:6, opacity:.8}}>Display name</div>
            <input placeholder="Your name" />
          </label>
          <label>
            <div style={{marginBottom:6, opacity:.8}}>Bio</div>
            <textarea rows={4} placeholder="Tell us about yourself" />
          </label>
          <button className="button">Save</button>
        </div>
      </div>
      <div className="card">
        <h2>Your Posts</h2>
        <p>Post list will migrate here later.</p>
      </div>
    </div>
  )
}
