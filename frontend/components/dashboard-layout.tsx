"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppSidebar } from "./app-sidebar"
import { ThemeToggle } from "./theme-toggle"
import { HeaderSearch } from "./header-search"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="flex-1 md:ml-64">
        {/* Top header */}
        <header className="sticky top-0 bg-card border-b border-border z-20">
          <div className="flex items-center justify-between p-4 md:p-6 gap-4">
            <HeaderSearch />
            <div className="flex items-center gap-4 ml-auto flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
