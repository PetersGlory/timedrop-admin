"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin, getProfile } from "@/lib/api"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem("jwt_token")
    if (token) {
      // Validate token and get user info from API
      getProfile()
        .then((profile) => {
          setUser(profile)
        })
        .catch(() => {
          // localStorage.removeItem("jwt_token")
          setUser(null)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiLogin(email, password)
      if (res && res.token && res.user && res.user.role !== "user") {
        localStorage.setItem("jwt_token", res.token)
        localStorage.setItem("user_role", res.user.role)
        setUser(res.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("jwt_token")
    setUser(null)
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
