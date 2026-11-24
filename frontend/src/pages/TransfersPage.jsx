import { useBankingDashboard } from '../hooks/useBankingDashboard.js'
import { TransfersSection } from '../views/customer/TransfersView.jsx'

export default function TransfersPage() {
  const { account, formatMoney } = useBankingDashboard()
  return <TransfersSection account={account} formatMoney={formatMoney} />
}
