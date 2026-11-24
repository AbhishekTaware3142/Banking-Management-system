import { Landmark, Plus } from 'lucide-react'
import { useBankingDashboard } from '../hooks/useBankingDashboard.js'
import { OverviewSection } from '../views/customer/OverviewView.jsx'

export default function OverviewPage() {
  const {
    account,
    activeRole,
    displayedTransactions,
    overviewCtrl,
    formatMoney,
    setModal,
    setView,
    setReceiptTx,
    isAdminCustomerView,
  } = useBankingDashboard()

  if (!account) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '40px auto',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Landmark size={26} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
          {activeRole === 'CUSTOMER' ? 'Open Your First Banking Account' : 'No Customer Account Selected'}
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          {activeRole === 'CUSTOMER'
            ? 'Start managing balances, making instant wire transfers, and tracking credit facilities.'
            : 'Select an available customer account to preview its banking dashboard.'}
        </p>
        {activeRole === 'CUSTOMER' && (
          <button type="button" className="btn-primary" onClick={() => setModal('account')}>
            <Plus size={16} />
            <span>Open Savings / Current Account</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <OverviewSection
      account={account}
      transactions={displayedTransactions}
      activeLoans={overviewCtrl.activeLoans}
      formatMoney={formatMoney}
      totalInflows={overviewCtrl.totalInflows}
      totalOutflows={overviewCtrl.totalOutflows}
      onAction={setModal}
      onNavigate={setView}
      onViewReceipt={(transaction) => {
        setReceiptTx(transaction)
        setModal('receipt')
      }}
      readOnly={isAdminCustomerView}
    />
  )
}
