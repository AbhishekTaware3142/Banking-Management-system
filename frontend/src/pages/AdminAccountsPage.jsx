import { useBankingDashboard } from '../hooks/useBankingDashboard.js'
import { AdminAccountsSection } from '../views/admin/AdminAccountsView.jsx'

export default function AdminAccountsPage() {
  const { allAccounts, formatMoney, openAdminCustomerView, showToast } = useBankingDashboard()

  return (
    <AdminAccountsSection
      allAccounts={allAccounts}
      formatMoney={formatMoney}
      onSelectAccount={(account) => {
        openAdminCustomerView(account.id)
        showToast(`Viewing account ${account.accountNumber} in Customer view.`)
      }}
    />
  )
}
