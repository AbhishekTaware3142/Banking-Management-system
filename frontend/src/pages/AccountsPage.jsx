import { useBankingDashboard } from '../hooks/useBankingDashboard.js'
import { AccountsSection } from '../views/customer/AccountsView.jsx'

export default function AccountsPage() {
  const { accounts, accountId, setAccountId, setModal, formatMoney } = useBankingDashboard()

  return (
    <AccountsSection
      accounts={accounts}
      activeId={accountId}
      onSelect={setAccountId}
      onCreate={() => setModal('account')}
      formatMoney={formatMoney}
    />
  )
}
