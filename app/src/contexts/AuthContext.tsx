import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../lib/supabase'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
  points?: number
  rank?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: any) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user
      api.auth.getMe(token)
        .then((data) => {
          if (data.user) {
            setUser(data.user)
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password })
    if (data.error) throw new Error(data.error)
    
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const data = await api.auth.register({
      email,
      password,
      name: metadata?.full_name || metadata?.name || email.split('@')[0],
      role: metadata?.role || 'student'
    })
    if (data.error) throw new Error(data.error)
    
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const signOut = async () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
