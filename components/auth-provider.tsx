"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, logout } from "@/lib/auth"

interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  handleLogout: () => void
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    const auth = isAuthenticated()
    setIsLoggedIn(auth)
    setIsLoading(false)

    if (!auth && pathname !== "/login") {
      router.push("/login")
    } else if (auth && pathname === "/login") {
      router.push("/")
    }
  }, [pathname, router])

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, handleLogout }}>{children}</AuthContext.Provider>
}
