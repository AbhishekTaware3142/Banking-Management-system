import { useState } from 'react'
import { CheckCircle2, Search, X } from 'lucide-react'
import { dateTime } from '../../utils/formatters.js'

/* --------------------------------------------------------------------------
   ADMIN VIEW 2: ALL BANK ACCOUNTS FULL DIRECTORY
   -------------------------------------------------------------------------- */
export function AdminAccountsSection({ allAccounts, formatMoney, onSelectAccount }) {
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
            <h3>Multi-Customer Master Account Register</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Full institutional directory of {allAccounts.length} customer accounts with balances and KYC verification.
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
                placeholder="Search accounts…"
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

        <div style={{ overflowX: 'auto' }}>
          <table className="master-table">
            <thead>
              <tr>
                <th>Customer Entity</th>
                <th>Account Number</th>
                <th>Type</th>
                <th>Available Balance</th>
                <th>Status</th>
                <th>Opened Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc) => (
                <tr key={acc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="account-pill-avatar" style={{ width: '32px', height: '32px' }}>
                        {acc.holderName ? acc.holderName.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <strong>{acc.holderName}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Primary Client</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-account-pill">{acc.accountNumber}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: acc.accountType === 'SAVINGS' ? '#ecfdf5' : '#eff6ff',
                        color: acc.accountType === 'SAVINGS' ? '#047857' : '#1d4ed8',
                      }}
                    >
                      {acc.accountType}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontSize: '15px', color: '#0f172a' }}>{formatMoney(acc.balance)}</strong>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '12px', fontWeight: '600' }}>
                      <CheckCircle2 size={14} />
                      <span>Active</span>
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>
                    {acc.openedAt ? dateTime.format(new Date(acc.openedAt)) : '15 Jan 2026'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '11px' }}
                      onClick={() => onSelectAccount(acc)}
                    >
                      <span>Switch to View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
