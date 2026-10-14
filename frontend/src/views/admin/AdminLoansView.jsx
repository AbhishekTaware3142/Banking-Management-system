import { FileText, Landmark } from 'lucide-react'

/* --------------------------------------------------------------------------
   ADMIN VIEW 3: INSTITUTIONAL LOANS BOOK
   -------------------------------------------------------------------------- */
export function AdminLoansSection({ allLoans, formatMoney }) {
  const totalPrincipal = allLoans.reduce((sum, l) => sum + Number(l.principal || 0), 0)
  const totalOutstanding = allLoans.reduce((sum, l) => sum + Number(l.outstandingPrincipal || 0), 0)

  return (
    <div>
      <div className="admin-stats-grid" style={{ marginBottom: '20px' }}>
        <div className="admin-metric-card card-loans">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Total Disbursed Credit</span>
            <FileText size={20} color="#7c3aed" />
          </div>
          <div className="admin-metric-val">{formatMoney(totalPrincipal)}</div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-purple">{allLoans.length} Active Facilities</span>
            <span>Zero Default Risk</span>
          </div>
        </div>

        <div className="admin-metric-card card-vault">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Total Outstanding Principal</span>
            <Landmark size={20} color="#059669" />
          </div>
          <div className="admin-metric-val">{formatMoney(totalOutstanding)}</div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-emerald">100% Scheduled Recovery</span>
            <span>Weighted Tenor: 24 Months</span>
          </div>
        </div>
      </div>

      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>Active Credit Facilities Register</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Borrower profiles, sanctioned principal, annual interest rates, and installment recovery progress.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="master-table">
            <thead>
              <tr>
                <th>Loan Reference</th>
                <th>Borrower Account</th>
                <th>Sanctioned Principal</th>
                <th>Interest Rate</th>
                <th>Monthly Installment</th>
                <th>Outstanding Balance</th>
                <th>Repayment Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allLoans.map((loan) => {
                const paid = Number(loan.paidInstallments || 0)
                const term = Number(loan.termMonths || 1)
                const pct = Math.min(100, Math.round((paid / term) * 100))
                return (
                  <tr key={loan.id}>
                    <td>
                      <span className="table-account-pill">{loan.id.slice(-8)}</span>
                    </td>
                    <td>
                      <strong>{loan.holderName || loan.accountId.slice(-8)}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                        {loan.accountNumber || loan.accountId}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{formatMoney(loan.principal)}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#2563eb' }}>{loan.annualRatePercent}% p.a.</span>
                    </td>
                    <td style={{ fontWeight: '600', color: '#0f172a' }}>
                      {formatMoney(loan.emi)}/mo
                    </td>
                    <td>
                      <strong style={{ color: '#7c3aed' }}>{formatMoney(loan.outstandingPrincipal)}</strong>
                    </td>
                    <td style={{ minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#2563eb', borderRadius: '4px' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>
                          {paid}/{term}m
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
