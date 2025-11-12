import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import MapPage from './pages/MapPage'
import LessonsPage from './pages/LessonsPage'

export default function App() {
  return (
    <>
      <header className="site">
        <h1 style={{background:'linear-gradient(90deg,#8b5cf6,#ec4899,#06b6d4)', WebkitBackgroundClip:'text', color:'transparent'}}>NeonCanvas React</h1>
        <nav className="nav">
          <Link className="button" to="/">Home</Link>
          <Link className="button" to="/dashboard">Dashboard</Link>
          <Link className="button" to="/lessons">Lessons</Link>
          <Link className="button" to="/leaderboard">Leaderboard</Link>
          <Link className="button" to="/map">Map</Link>
          <Link className="button" to="/profile">Profile</Link>
          <Link className="button" to="/login">Login</Link>
        </nav>
      </header>
      <main className="site fade-in">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
        </Routes>
      </main>
      <footer className="site">© {new Date().getFullYear()} NeonCanvas React Migration</footer>
    </>
  )
}
