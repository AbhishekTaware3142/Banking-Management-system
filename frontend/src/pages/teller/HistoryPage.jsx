import { useBankingDashboard } from '../../hooks/useBankingDashboard.js'
import { TellerHistorySection } from '../../views/teller/HistoryView.jsx'

export default function TellerHistoryPage() {
  const { allTransactions, formatMoney, historyCtrl } = useBankingDashboard()

  return (
    <TellerHistorySection
      allTransactions={allTransactions}
      formatMoney={formatMoney}
      onViewReceipt={historyCtrl.viewReceipt}
    />
  )
}
