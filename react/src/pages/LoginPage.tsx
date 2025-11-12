import React from 'react'

export default function LoginPage() {
  return (
    <div className="card" style={{maxWidth:480}}>
      <h2>Login</h2>
      <div className="grid" style={{gridTemplateColumns:'1fr'}}>
        <label>
          <div style={{marginBottom:6, opacity:.8}}>Email</div>
          <input placeholder="you@example.com" type="email" />
        </label>
        <label>
          <div style={{marginBottom:6, opacity:.8}}>Password</div>
          <input placeholder="••••••••" type="password" />
        </label>
        <button className="button">Sign in</button>
      </div>
    </div>
  )
}
