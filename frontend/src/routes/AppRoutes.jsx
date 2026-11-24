import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthView from '../views/auth/AuthView.jsx'
import BankingDashboard from '../pages/BankingDashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import { DashboardLanding, RoleRoute } from './RoleRoute.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import AccountsPage from '../pages/AccountsPage.jsx'
import TransfersPage from '../pages/TransfersPage.jsx'
import ActivityPage from '../pages/ActivityPage.jsx'
import LoansPage from '../pages/LoansPage.jsx'
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx'
import AdminAccountsPage from '../pages/AdminAccountsPage.jsx'
import AdminLoansPage from '../pages/AdminLoansPage.jsx'
import AdminAuditPage from '../pages/AdminAuditPage.jsx'
import AdminEmployeesPage from '../pages/AdminEmployeesPage.jsx'
import TellerDeskPage from '../pages/TellerDeskPage.jsx'
import TellerAccountsPage from '../pages/TellerAccountsPage.jsx'
import TellerLoansPage from '../pages/TellerLoansPage.jsx'
import TellerHistoryPage from '../pages/TellerHistoryPage.jsx'

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
        <Route path="/app" element={<BankingDashboard />}>
          <Route index element={<DashboardLanding />} />

          <Route element={<RoleRoute allowedRoles={['CUSTOMER']} />}>
            <Route path="customer/overview" element={<DashboardPage />} />
            <Route path="customer/accounts" element={<AccountsPage />} />
            <Route path="customer/transfers" element={<TransfersPage />} />
            <Route path="customer/activity" element={<ActivityPage />} />
            <Route path="customer/loans" element={<LoansPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="admin/overview" element={<AdminDashboardPage />} />
            <Route path="admin/customer" element={<DashboardPage />} />
            <Route path="admin/accounts" element={<AdminAccountsPage />} />
            <Route path="admin/loans" element={<AdminLoansPage />} />
            <Route path="admin/audit" element={<AdminAuditPage />} />
            <Route path="admin/employees" element={<AdminEmployeesPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['EMPLOYEE']} />}>
            <Route path="teller/desk" element={<TellerDeskPage />} />
            <Route path="teller/accounts" element={<TellerAccountsPage />} />
            <Route path="teller/loans" element={<TellerLoansPage />} />
            <Route path="teller/history" element={<TellerHistoryPage />} />
          </Route>

          <Route path="*" element={<DashboardLanding />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  )
}