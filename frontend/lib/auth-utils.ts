// Auth utilities and hooks
export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Simple in-memory auth store (replace with real auth in production)
let currentUser: AuthUser | null = null

export const getStoredUser = (): AuthUser | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("stockmaster_user")
    return stored ? JSON.parse(stored) : null
  }
  return currentUser
}

export const setStoredUser = (user: AuthUser | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("stockmaster_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("stockmaster_user")
    }
  }
  currentUser = user
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}
