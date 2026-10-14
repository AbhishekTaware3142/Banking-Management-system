import { useState } from 'react'
import { FileText, Landmark, Search, TrendingUp, X } from 'lucide-react'

/* --------------------------------------------------------------------------
   EMPLOYEE / TELLER VIEW: ALL CUSTOMER LOANS
   -------------------------------------------------------------------------- */
export function TellerLoansSection({ allLoans, formatMoney }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filtered = allLoans.filter((loan) => {
    if (statusFilter !== 'ALL' && loan.status !== statusFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (loan.holderName || '').toLowerCase().includes(q) ||
      (loan.accountNumber || loan.accountId || '').toLowerCase().includes(q)
    )
  })

  const totalPrincipal = filtered.reduce((s, l) => s + Number(l.principal || 0), 0)
  const totalOutstanding = filtered.reduce((s, l) => s + Number(l.outstandingPrincipal || 0), 0)
  const activeCount = filtered.filter((l) => l.status === 'ACTIVE').length

  return (
    <div>
      {/* Summary KPI Strip */}
      <div className="admin-stats-grid" style={{ marginBottom: '20px' }}>
        <div className="admin-metric-card card-loans">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Total Disbursed Credit</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <FileText size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{formatMoney(totalPrincipal)}</div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-purple">{allLoans.length} Total Loans</span>
            <span>All-time Disbursements</span>
          </div>
        </div>

        <div className="admin-metric-card card-vault">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Outstanding Principal</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Landmark size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{formatMoney(totalOutstanding)}</div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-emerald">{activeCount} Active</span>
            <span>Pending Recovery Balance</span>
          </div>
        </div>

        <div className="admin-metric-card card-deposits">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Recovery Rate</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="admin-metric-val">
            {totalPrincipal > 0 ? (((totalPrincipal - totalOutstanding) / totalPrincipal) * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-blue">On Schedule</span>
            <span>Principal Recovered</span>
          </div>
        </div>
      </div>

      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>All Customer Loan Facilities ({filtered.length} shown)</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Full credit book — sanctioned principal, interest rates, EMI schedule, and repayment progress.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {['ALL', 'ACTIVE', 'PAID'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: statusFilter === s ? '#ffffff' : 'transparent',
                    color: statusFilter === s ? '#0f172a' : '#64748b',
                    boxShadow: statusFilter === s ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="search-box-container">
              <Search size={14} color="#64748b" />
              <input
                type="text"
                placeholder="Search borrower…"
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
                <th>Loan Reference</th>
                <th>Borrower / Account</th>
                <th>Sanctioned Principal</th>
                <th>Rate</th>
                <th>Monthly EMI</th>
                <th>Outstanding</th>
                <th>Repayment Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No loans match the current filter.
                  </td>
                </tr>
              ) : filtered.map((loan) => {
                const paid = Number(loan.paidInstallments || 0)
                const term = Number(loan.termMonths || 1)
                const pct = Math.min(100, Math.round((paid / term) * 100))
                return (
                  <tr key={loan.id}>
                    <td>
                      <span className="table-account-pill">{loan.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="account-pill-avatar" style={{ width: '30px', height: '30px', fontSize: '12px', background: 'rgba(124,58,237,0.2)', color: '#a78bfa', borderColor: 'rgba(124,58,237,0.3)' }}>
                          {(loan.holderName || 'L').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '13px' }}>{loan.holderName || 'Customer'}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                            {loan.accountNumber || loan.accountId?.slice(-10)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{formatMoney(loan.principal)}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#2563eb' }}>{loan.annualRatePercent}% p.a.</span>
                    </td>
                    <td style={{ fontWeight: '600', color: '#0f172a' }}>
                      {formatMoney(loan.emi)}<span style={{ color: '#94a3b8', fontWeight: '400' }}>/mo</span>
                    </td>
                    <td>
                      <strong style={{ color: loan.status === 'PAID' ? '#059669' : '#7c3aed' }}>
                        {formatMoney(loan.outstandingPrincipal)}
                      </strong>
                    </td>
                    <td style={{ minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background: loan.status === 'PAID' ? '#10b981' : '#3b82f6',
                              borderRadius: '4px',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {paid}/{term}m ({pct}%)
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background: loan.status === 'ACTIVE' ? '#eff6ff' : '#ecfdf5',
                          color: loan.status === 'ACTIVE' ? '#1d4ed8' : '#047857',
                        }}
                      >
                        {loan.status}
                      </span>
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
