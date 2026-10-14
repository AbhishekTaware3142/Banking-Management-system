import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute() {
  const { user, isCheckingSession } = useAuth()

  if (isCheckingSession) return <div className="auth-wrapper">Checking session…</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}