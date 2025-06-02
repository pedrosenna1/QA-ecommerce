"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useBugMode } from "./bug-mode-context"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { bugMode } = useBugMode()

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Bug mode: Sometimes login fails even with correct credentials
      if (bugMode && Math.random() > 0.7) {
        setIsLoading(false)
        return { success: false, message: "Erro de servidor. Tente novamente mais tarde." }
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setIsLoading(false)
        return { success: false, message: data.message || "Falha no login" }
      }

      setUser(data.user)
      setIsLoading(false)
      return { success: true, message: "Login realizado com sucesso!" }
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return { success: false, message: "Ocorreu um erro ao fazer login. Tente novamente." }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      // Bug mode: Sometimes registration fails
      if (bugMode && Math.random() > 0.7) {
        setIsLoading(false)
        return { success: false, message: "Erro de servidor. Tente novamente mais tarde." }
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setIsLoading(false)
        return { success: false, message: data.message || "Falha no registro" }
      }

      setUser(data.user)
      setIsLoading(false)
      return { success: true, message: "Conta criada com sucesso!" }
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
      return { success: false, message: "Ocorreu um erro ao criar sua conta. Tente novamente." }
    }
  }

  const logout = () => {
    setUser(null)
  }

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return false

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...userData }),
      })

      const data = await response.json()

      if (!response.ok) {
        return false
      }

      // Update the current user state
      setUser((prev) => {
        if (!prev) return null
        return { ...prev, ...userData }
      })

      return true
    } catch (error) {
      console.error("Update profile error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
