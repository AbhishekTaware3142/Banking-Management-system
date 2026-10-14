import { CreditCard, Plus } from 'lucide-react'

/* --------------------------------------------------------------------------
   VIEW 2: ACCOUNTS & CARDS
   -------------------------------------------------------------------------- */
export function AccountsSection({
  accounts,
  activeId,
  onSelect,
  onCreate,
  formatMoney,
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '24px' }}>
      <div className="content-card-panel">
        <div className="panel-header-row">
          <div>
            <h2>Your Bank Accounts</h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Connected accounts under your private banking profile
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={onCreate}>
            <Plus size={15} />
            <span>Open Account</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {accounts.map((acc) => {
            const isSelected = acc.id === activeId
            return (
              <div
                key={acc.id}
                onClick={() => onSelect(acc.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                  border: isSelected ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: isSelected ? '#10b981' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>
                      {acc.accountType} Account
                    </strong>
                    <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                      {acc.accountNumber} · Holder: {acc.holderName}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                    {formatMoney(acc.balance)}
                  </span>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
                    {isSelected ? '● Active View' : 'Switch'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Card Controls Panel */}
      <div className="content-card-panel">
        <div className="panel-header-row">
          <h2>Payment Cards</h2>
        </div>
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          No card records are available from the banking API.
        </p>
      </div>
    </div>
  )
}
