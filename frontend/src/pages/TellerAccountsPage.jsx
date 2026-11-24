import { useBankingDashboard } from '../hooks/useBankingDashboard.js'
import { TellerAccountsSection } from '../views/teller/AccountsView.jsx'

export default function TellerAccountsPage() {
  const { allAccounts, formatMoney, deskCtrl } = useBankingDashboard()

  return (
    <TellerAccountsSection
      allAccounts={allAccounts}
      formatMoney={formatMoney}
      onTellerAction={deskCtrl.openTellerModal}
    />
  )
}
