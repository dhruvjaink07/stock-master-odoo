"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import { Package } from "lucide-react"

export function AuthLanding() {
  const router = useRouter()
  const { signup, login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpEmail, setOtpEmail] = useState("")
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  const [filledInputs, setFilledInputs] = useState<Set<string>>(new Set())

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const name = formData.get("signup-name") as string
      const email = formData.get("signup-email") as string
      const password = formData.get("signup-password") as string
      const confirmPassword = formData.get("signup-confirm") as string

      if (!name || !email || !password) {
        throw new Error("All fields are required")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      await signup(email, password, name)
      toast.success("Account created successfully! Redirecting...")
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (error: any) {
      toast.error(error.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("login-email") as string
      const password = formData.get("login-password") as string

      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      await login(email, password)
      toast.success("Logged in successfully! Redirecting...")
      setTimeout(() => router.push("/dashboard"), 1500)
    } catch (error: any) {
      toast.error(error.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = (email: string) => {
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    setOtpEmail(email)
    setShowOtpModal(true)
    toast.success("OTP sent to your email")
  }

  const getLabelClasses = (inputName: string, hasValue: boolean) => {
    const isActive = focusedInput === inputName || hasValue
    return `absolute left-4 transition-all duration-200 pointer-events-none ${
      isActive ? "top-2 text-xs text-primary font-medium" : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
    }`
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/modern-warehouse-interior-with-shelves-forklifts-a.jpg"
          alt="Warehouse background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#A3BFFA] backdrop-blur-sm mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">StockMaster</h1>
          <p className="text-white/90 text-lg drop-shadow">Inventory Management System</p>
        </div>

        {/* Form Container with Glass Effect */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50/50 dark:bg-blue-900/20 p-1 rounded-xl mb-6">
              <TabsTrigger
                value="login"
                className="rounded-lg data-[state=active]:bg-[#A3BFFA] data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-lg data-[state=active]:bg-[#A3BFFA] data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-5 mt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="relative">
                  <Input
                    name="login-email"
                    type="email"
                    disabled={isLoading}
                    className="h-14 pt-6 pb-2 px-4 rounded-xl border-0 bg-muted/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue/20 transition-all"
                    onFocus={() => setFocusedInput("login-email")}
                    onBlur={(e) => {
                      setFocusedInput(null)
                      if (e.target.value) {
                        setFilledInputs((prev) => new Set(prev).add("login-email"))
                      } else {
                        setFilledInputs((prev) => {
                          const next = new Set(prev)
                          next.delete("login-email")
                          return next
                        })
                      }
                    }}
                  />
                  <label className={getLabelClasses("login-email", filledInputs.has("login-email"))}>
                    Email Address
                  </label>
                </div>

                <div className="relative">
                  <Input
                    name="login-password"
                    type="password"
                    disabled={isLoading}
                    className="h-14 pt-6 pb-2 px-4 rounded-xl border-0 bg-muted/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue/20 transition-all"
                    onFocus={() => setFocusedInput("login-password")}
                    onBlur={(e) => {
                      setFocusedInput(null)
                      if (e.target.value) {
                        setFilledInputs((prev) => new Set(prev).add("login-password"))
                      } else {
                        setFilledInputs((prev) => {
                          const next = new Set(prev)
                          next.delete("login-password")
                          return next
                        })
                      }
                    }}
                  />
                  <label className={getLabelClasses("login-password", filledInputs.has("login-password"))}>
                    Password
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#A3BFFA] hover:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="w-full text-blue hover:text-blue-600"
                  onClick={() => handleForgotPassword("demo@example.com")}
                >
                  Forgot Password?
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-5 mt-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="relative">
                  <Input
                    name="signup-name"
                    disabled={isLoading}
                    className="h-14 pt-6 pb-2 px-4 rounded-xl border-0 bg-muted/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue/20 transition-all"
                    onFocus={() => setFocusedInput("signup-name")}
                    onBlur={(e) => {
                      setFocusedInput(null)
                      if (e.target.value) {
                        setFilledInputs((prev) => new Set(prev).add("signup-name"))
                      } else {
                        setFilledInputs((prev) => {
                          const next = new Set(prev)
                          next.delete("signup-name")
                          return next
                        })
                      }
                    }}
                  />
                  <label className={getLabelClasses("signup-name", filledInputs.has("signup-name"))}>Full Name</label>
                </div>

                <div className="relative">
                  <Input
                    name="signup-email"
                    type="email"
                    disabled={isLoading}
                    className="h-14 pt-6 pb-2 px-4 rounded-xl border-0 bg-muted/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue/20 transition-all"
                    onFocus={() => setFocusedInput("signup-email")}
                    onBlur={(e) => {
                      setFocusedInput(null)
                      if (e.target.value) {
                        setFilledInputs((prev) => new Set(prev).add("signup-email"))
                      } else {
                        setFilledInputs((prev) => {
                          const next = new Set(prev)
                          next.delete("signup-email")
                          return next
                        })
                      }
                    }}
                  />
                  <label className={getLabelClasses("signup-email", filledInputs.has("signup-email"))}>
                    Email Address
                  </label>
                </div>

                <div className="relative">
                  <Input
                    name="signup-password"
                    type="password"
                    disabled={isLoading}
                    className="h-14 pt-6 pb-2 px-4 rounded-xl border-0 bg-muted/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue/20 transition-all"
                    onFocus={() => setFocusedInput("signup-password")}
                    onBlur={(e) => {
                      setFocusedInput(null)
                      if (e.target.value) {
                        setFilledInputs((prev) => new Set(prev).add("signup-password"))
                      } else {
                        setFilledInputs((prev) => {
                          const next = new Set(prev)
                          next.delete("signup-password")
                          return next
                        })
                      }
                    }}
                  />
                  <label className={getLabelClasses("signup-password", filledInputs.has("signup-password"))}>
                    Password
                  </label>
                </div>

                <div className="relative">
                  <Input
                    name="signup-confirm"
                    type="password"
                    disabled={isLoading}
                    className="h-14 pt-6 pb-2 px-4 rounded-xl border-0 bg-muted/50 shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue/20 transition-all"
                    onFocus={() => setFocusedInput("signup-confirm")}
                    onBlur={(e) => {
                      setFocusedInput(null)
                      if (e.target.value) {
                        setFilledInputs((prev) => new Set(prev).add("signup-confirm"))
                      } else {
                        setFilledInputs((prev) => {
                          const next = new Set(prev)
                          next.delete("signup-confirm")
                          return next
                        })
                      }
                    }}
                  />
                  <label className={getLabelClasses("signup-confirm", filledInputs.has("signup-confirm"))}>
                    Confirm Password
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-[#A3BFFA] hover:bg-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm rounded-2xl border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-blue">Reset Password</CardTitle>
              <CardDescription>Enter the 6-digit OTP sent to {otpEmail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="000000"
                maxLength={6}
                type="text"
                className="h-12 text-center text-lg tracking-widest rounded-xl border-0 bg-muted/50 shadow-sm focus:ring-2 focus:ring-blue/20"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-blue/20 hover:bg-blue/5 bg-transparent"
                  onClick={() => setShowOtpModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl bg-[#A3BFFA] hover:bg-blue-600 text-white shadow-md"
                  onClick={() => {
                    toast.success("Password reset successful")
                    setShowOtpModal(false)
                  }}
                >
                  Verify & Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
