import { useState } from 'react'
import { ArrowUpRight, Plus, Search, X } from 'lucide-react'

/* --------------------------------------------------------------------------
   EMPLOYEE / TELLER VIEW 2: ALL CUSTOMER ACCOUNTS DIRECTORY
   -------------------------------------------------------------------------- */
export function TellerAccountsSection({ allAccounts, formatMoney, onTellerAction }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')

  const filtered = allAccounts.filter((acc) => {
    if (filterType !== 'ALL' && acc.accountType !== filterType) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (acc.holderName || '').toLowerCase().includes(q) ||
      (acc.accountNumber || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>Customer Accounts Counter Register</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Execute counter cash deposits and withdrawals on behalf of any verified customer account.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {['ALL', 'SAVINGS', 'CURRENT'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: filterType === t ? '#ffffff' : 'transparent',
                    color: filterType === t ? '#0f172a' : '#64748b',
                    boxShadow: filterType === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="search-box-container">
              <Search size={14} color="#64748b" />
              <input
                type="text"
                placeholder="Search customers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="search-clear-btn" onClick={() => setSearch('')}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          <div className="teller-customers-grid">
            {filtered.map((acc) => (
              <div className="teller-customer-card" key={acc.id}>
                <div>
                  <div className="teller-customer-header">
                    <div className="teller-customer-avatar">
                      {acc.holderName ? acc.holderName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="teller-customer-names">
                      <strong>{acc.holderName}</strong>
                      <small>{acc.accountNumber}</small>
                    </div>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                        fontWeight: '700',
                        background: acc.accountType === 'SAVINGS' ? '#ecfdf5' : '#eff6ff',
                        color: acc.accountType === 'SAVINGS' ? '#047857' : '#1d4ed8',
                      }}
                    >
                      {acc.accountType}
                    </span>
                  </div>

                  <div className="teller-customer-balance-box">
                    <span>Available Customer Balance</span>
                    <strong>{formatMoney(acc.balance)}</strong>
                  </div>
                </div>

                <div className="teller-card-actions">
                  <button
                    type="button"
                    className="btn-teller-deposit"
                    onClick={() => onTellerAction('DEPOSIT', acc)}
                  >
                    <Plus size={14} />
                    <span>+ Deposit Cash</span>
                  </button>
                  <button
                    type="button"
                    className="btn-teller-withdraw"
                    onClick={() => onTellerAction('WITHDRAW', acc)}
                  >
                    <ArrowUpRight size={14} />
                    <span>- Withdraw Cash</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
