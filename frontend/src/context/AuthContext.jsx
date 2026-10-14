import { createContext, useContext } from 'react'
import { useAuthController } from '../controllers/useAuthController.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useAuthController()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside AuthProvider')
  return auth
}