import { useBankingDashboard } from '../../hooks/useBankingDashboard.js'
import { TellerDeskSection } from '../../views/teller/DeskView.jsx'

export default function DeskPage() {
  const { allAccounts, allTransactions, deskCtrl, historyCtrl, formatMoney, setView } =
    useBankingDashboard()

  return (
    <TellerDeskSection
      allAccounts={allAccounts}
      allTransactions={allTransactions}
      tellerGraphData={deskCtrl.tellerGraphData}
      shiftStats={deskCtrl.tellerShiftStats}
      formatMoney={formatMoney}
      onTellerAction={deskCtrl.openTellerModal}
      onViewReceipt={historyCtrl.viewReceipt}
      onNavigate={setView}
    />
  )
}
