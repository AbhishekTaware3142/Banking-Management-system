import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthView from '../views/auth/AuthView.jsx'
import BankingDashboard from '../pages/BankingDashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

function LoginRoute() {
  const { user, isCheckingSession, login, register } = useAuth()

  if (isCheckingSession) return <div className="auth-wrapper">Checking session…</div>
  if (user) return <Navigate to="/app" replace />

  return <AuthView onLogin={login} onRegister={register} />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app/*" element={<BankingDashboard />} />
      </Route>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}