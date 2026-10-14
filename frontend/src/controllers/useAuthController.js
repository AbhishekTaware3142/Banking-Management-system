import { useEffect, useState } from 'react'
import { authService } from '../services/authService.js'

export function useAuthController() {
  const [user, setUser] = useState(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    let active = true
    authService.currentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setIsCheckingSession(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function login(credentials) {
    const authenticatedUser = await authService.login(credentials)
    setUser(authenticatedUser)
    return authenticatedUser
  }

  async function register(details) {
    const registeredUser = await authService.register(details)
    setUser(registeredUser)
    return registeredUser
  }

  async function logout() {
    await authService.logout().catch(() => {})
    setUser(null)
  }

  return {
    user,
    setUser,
    isCheckingSession,
    login,
    register,
    logout,
  }
}