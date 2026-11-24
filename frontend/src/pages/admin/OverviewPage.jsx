import { useBankingDashboard } from '../../hooks/useBankingDashboard.js'
import { AdminOverviewSection } from '../../views/admin/AdminOverviewView.jsx'

export default function AdminOverviewPage() {
  const { bankStats, allAccounts, allTransactions, formatMoney, adminOverviewCtrl } =
    useBankingDashboard()

  return (
    <AdminOverviewSection
      bankStats={bankStats}
      allAccounts={allAccounts}
      allTransactions={allTransactions}
      formatMoney={formatMoney}
      onNavigate={adminOverviewCtrl.navigateTo}
    />
  )
}
