import { useBankingDashboard } from '../../hooks/useBankingDashboard.js'
import { ActivitySection } from '../../views/customer/ActivityView.jsx'

export default function ActivityPage() {
  const {
    activityCtrl,
    displayedTransactions,
    formatMoney,
    setModal,
    setReceiptTx,
  } = useBankingDashboard()

  return (
    <ActivitySection
      transactions={activityCtrl.filteredTransactions}
      allTransactionsCount={displayedTransactions.length}
      activityFilter={activityCtrl.activityFilter}
      setActivityFilter={activityCtrl.setActivityFilter}
      searchQuery={activityCtrl.searchQuery}
      setSearchQuery={activityCtrl.setSearchQuery}
      onExport={activityCtrl.exportStatement}
      formatMoney={formatMoney}
      onViewReceipt={(transaction) => {
        setReceiptTx(transaction)
        setModal('receipt')
      }}
    />
  )
}
