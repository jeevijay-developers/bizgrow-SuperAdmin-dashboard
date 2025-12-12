// Simple auth utilities for static login
export const AUTH_CREDENTIALS = {
  email: "admin@bizgrow360.com",
  password: "admin123",
}

export const AUTH_COOKIE_NAME = "bizgrow360_auth"

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_COOKIE_NAME) === "true"
}

export function login(email: string, password: string): boolean {
  if (email === AUTH_CREDENTIALS.email && password === AUTH_CREDENTIALS.password) {
    localStorage.setItem(AUTH_COOKIE_NAME, "true")
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(AUTH_COOKIE_NAME)
}
