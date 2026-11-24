import { useBankingDashboard } from '../hooks/useBankingDashboard.js'
import { AdminLoansSection } from '../views/admin/AdminLoansView.jsx'

export default function AdminLoansPage() {
  const { allLoans, formatMoney } = useBankingDashboard()
  return <AdminLoansSection allLoans={allLoans} formatMoney={formatMoney} />
}
