import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import AuthView from '../views/auth/AuthView.jsx'
import BankingDashboard from '../pages/BankingDashboard.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import { DashboardLanding, RoleRoute } from './RoleRoute.jsx'
import CustomerOverviewPage from '../pages/customer/OverviewPage.jsx'
import CustomerAccountsPage from '../pages/customer/AccountsPage.jsx'
import CustomerTransfersPage from '../pages/customer/TransfersPage.jsx'
import CustomerActivityPage from '../pages/customer/ActivityPage.jsx'
import CustomerLoansPage from '../pages/customer/LoansPage.jsx'
import AdminOverviewPage from '../pages/admin/OverviewPage.jsx'
import AdminAccountsPage from '../pages/admin/AccountsPage.jsx'
import AdminLoansPage from '../pages/admin/LoansPage.jsx'
import AdminAuditPage from '../pages/admin/AuditPage.jsx'
import AdminEmployeesPage from '../pages/admin/EmployeesPage.jsx'
import TellerDeskPage from '../pages/teller/DeskPage.jsx'
import TellerAccountsPage from '../pages/teller/AccountsPage.jsx'
import TellerLoansPage from '../pages/teller/LoansPage.jsx'
import TellerHistoryPage from '../pages/teller/HistoryPage.jsx'

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
            <Route path="customer/overview" element={<CustomerOverviewPage />} />
            <Route path="customer/accounts" element={<CustomerAccountsPage />} />
            <Route path="customer/transfers" element={<CustomerTransfersPage />} />
            <Route path="customer/activity" element={<CustomerActivityPage />} />
            <Route path="customer/loans" element={<CustomerLoansPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="admin/overview" element={<AdminOverviewPage />} />
            <Route path="admin/customer" element={<CustomerOverviewPage />} />
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