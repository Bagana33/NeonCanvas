// API Client for MongoDB Backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  // Get token from localStorage
  getToken: () => localStorage.getItem('token'),

  // Auth endpoints
  auth: {
    register: async (data: { email: string; password: string; name: string; role?: string }) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    login: async (data: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    getMe: async (token: string) => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      return res.json()
    }
  },

  // Posts endpoints
  posts: {
    getAll: async (params?: { contestId?: string; userId?: string; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString()
      const res = await fetch(`${API_URL}/posts?${query}`)
      return res.json()
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/posts/${id}`)
      return res.json()
    },
    create: async (data: any, token: string) => {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      return res.json()
    },
    react: async (postId: string, reaction: string, token: string) => {
      const res = await fetch(`${API_URL}/posts/${postId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reaction })
      })
      return res.json()
    },
    comment: async (postId: string, text: string, token: string) => {
      const res = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      })
      return res.json()
    }
  },

  // Users endpoints
  users: {
    getLeaderboard: async (limit = 10) => {
      const res = await fetch(`${API_URL}/users/leaderboard?limit=${limit}`)
      return res.json()
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/users/${id}`)
      return res.json()
    },
    update: async (id: string, data: any, token: string) => {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      return res.json()
    }
  },

  // Lessons endpoints
  lessons: {
    getAll: async (params?: { subject?: string; grade?: string }) => {
      const query = new URLSearchParams(params as any).toString()
      const res = await fetch(`${API_URL}/lessons?${query}`)
      return res.json()
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/lessons/${id}`)
      return res.json()
    },
    submit: async (id: string, answers: any[], token: string) => {
      const res = await fetch(`${API_URL}/lessons/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      })
      return res.json()
    }
  },

  // Contests endpoints
  contests: {
    getAll: async (status?: string) => {
      const query = status ? `?status=${status}` : ''
      const res = await fetch(`${API_URL}/contests${query}`)
      return res.json()
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/contests/${id}`)
      return res.json()
    }
  }
}
