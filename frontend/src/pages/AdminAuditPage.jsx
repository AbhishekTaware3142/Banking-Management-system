import { useBankingDashboard } from '../hooks/useBankingDashboard.js'
import { AdminAuditSection } from '../views/admin/AuditView.jsx'

export default function AdminAuditPage() {
  const { allTransactions, formatMoney, auditCtrl } = useBankingDashboard()

  return (
    <AdminAuditSection
      allTransactions={allTransactions}
      formatMoney={formatMoney}
      onViewReceipt={auditCtrl.viewReceipt}
    />
  )
}
