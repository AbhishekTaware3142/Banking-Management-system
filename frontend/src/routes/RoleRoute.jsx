import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ROLE_HOME = {
  ADMIN: '/app/admin/overview',
  EMPLOYEE: '/app/teller/desk',
  CUSTOMER: '/app/customer/overview',
}

export function RoleRoute({ allowedRoles }) {
  const { user } = useAuth()
  const dashboardContext = useOutletContext()
  const role = user?.role?.toUpperCase() || 'CUSTOMER'

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || ROLE_HOME.CUSTOMER} replace />
  }

  return <Outlet context={dashboardContext} />
}

export function DashboardLanding() {
  const { user } = useAuth()
  const role = user?.role?.toUpperCase() || 'CUSTOMER'
  return <Navigate to={ROLE_HOME[role] || ROLE_HOME.CUSTOMER} replace />
}
