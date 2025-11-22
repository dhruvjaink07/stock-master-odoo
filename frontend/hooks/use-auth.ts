"use client"

import { useState, useEffect, useCallback } from "react"
import type { AuthUser, AuthState } from "@/lib/auth-utils"
import { getStoredUser, setStoredUser, validateEmail, validatePassword } from "@/lib/auth-utils"

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Load user on mount
  useEffect(() => {
    const user = getStoredUser()
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format")
    }
    if (!validatePassword(password)) {
      throw new Error("Password must be at least 6 characters")
    }

    const user: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
    }

    setStoredUser(user)
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    })

    return user
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format")
    }
    if (!validatePassword(password)) {
      throw new Error("Invalid password")
    }

    // Mock login - in production, validate against backend
    const user: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
    }

    setStoredUser(user)
    setState({
      user,
      isLoading: false,
      isAuthenticated: true,
    })

    return user
  }, [])

  const logout = useCallback(() => {
    setStoredUser(null)
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }, [])

  return {
    ...state,
    signup,
    login,
    logout,
  }
}
