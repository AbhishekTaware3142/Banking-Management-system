/* --------------------------------------------------------------------------
   VIEW 3: TRANSFERS & PAYMENTS
   -------------------------------------------------------------------------- */
export function TransfersSection({ account, formatMoney }) {
  if (!account) {
    return <p role="status">No account is available for transfers.</p>
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '24px' }}>
      <div className="content-card-panel">
        <div className="panel-header-row">
          <div>
            <h2>Transfers unavailable</h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              The banking API does not currently provide transfer or beneficiary endpoints.
            </p>
          </div>
        </div>

        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
            Debiting Account
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <div>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{account.accountType} Account</strong>
              <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {account.accountNumber}
              </div>
            </div>
            <strong style={{ fontSize: '16px', color: '#10b981' }}>{formatMoney(account.balance)}</strong>
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
          Saved Beneficiaries
        </h3>
        <p style={{ color: '#64748b', fontSize: '13px' }}>No beneficiary records are available.</p>
      </div>

      <div className="content-card-panel">
        <div className="panel-header-row">
          <h2>Selected Account</h2>
        </div>
        <strong style={{ color: '#0f172a' }}>{account.accountType} Account</strong>
        <p style={{ color: '#64748b', fontSize: '12px' }}>{account.accountNumber}</p>
        <p style={{ color: '#64748b', fontSize: '13px' }}>Available balance: {formatMoney(account.balance)}</p>
      </div>
    </div>
  )
}
