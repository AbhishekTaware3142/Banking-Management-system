import { useState } from 'react'
import { Printer, Search, X } from 'lucide-react'
import { dateTime } from '../../utils/formatters.js'

/* --------------------------------------------------------------------------
   ADMIN VIEW 4: GLOBAL AUDIT LEDGER
   -------------------------------------------------------------------------- */
export function AdminAuditSection({ allTransactions, formatMoney, onViewReceipt }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const filtered = allTransactions.filter((tx) => {
    if (typeFilter === 'DEPOSITS' && !tx.type.includes('DEPOSIT')) return false
    if (typeFilter === 'WITHDRAWALS' && !tx.type.includes('WITHDRAW')) return false
    if (typeFilter === 'TELLER' && !tx.type.includes('TELLER')) return false
    if (typeFilter === 'LOANS' && !tx.type.includes('LOAN') && !tx.type.includes('EMI')) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (tx.description || '').toLowerCase().includes(q) ||
      (tx.type || '').toLowerCase().includes(q) ||
      (tx.id || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>Global Bank Transaction Audit Stream</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Immutable real-time audit ledger across all customer deposits, teller withdrawals and loan disbursements.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {['ALL', 'DEPOSITS', 'WITHDRAWALS', 'TELLER', 'LOANS'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: typeFilter === t ? '#ffffff' : 'transparent',
                    color: typeFilter === t ? '#0f172a' : '#64748b',
                    boxShadow: typeFilter === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
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
                placeholder="Search audit trail…"
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
                <th>Audit ID</th>
                <th>Operation Type</th>
                <th>Narration / Counter Slip</th>
                <th>Transaction Amount</th>
                <th>Running Balance</th>
                <th>Recorded Timestamp</th>
                <th>Advice Slip</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const isPositive = Number(tx.amount) > 0
                return (
                  <tr key={tx.id}>
                    <td>
                      <span className="table-account-pill">{tx.id}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background: tx.type.includes('DEPOSIT')
                            ? '#ecfdf5'
                            : tx.type.includes('WITHDRAW')
                              ? '#fff1f2'
                              : '#eff6ff',
                          color: tx.type.includes('DEPOSIT')
                            ? '#047857'
                            : tx.type.includes('WITHDRAW')
                              ? '#be123c'
                              : '#1d4ed8',
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ color: '#334155', fontWeight: '500' }}>
                      {tx.description || 'Depository Movement'}
                    </td>
                    <td>
                      <strong style={{ color: isPositive ? '#059669' : '#e11d48', fontSize: '13px' }}>
                        {isPositive ? '+' : ''}{formatMoney(tx.amount)}
                      </strong>
                    </td>
                    <td style={{ color: '#0f172a', fontWeight: '600' }}>
                      {formatMoney(tx.balanceAfter)}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '12px' }}>
                      {dateTime.format(new Date(tx.createdAt))}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={() => onViewReceipt(tx)}
                      >
                        <Printer size={12} />
                        <span>Advice</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
