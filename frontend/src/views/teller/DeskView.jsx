import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Plus, Printer, Search, X } from 'lucide-react'
import { dateTime, money } from '../../utils/formatters.js'

/* --------------------------------------------------------------------------
   EMPLOYEE / TELLER VIEW 1: COUNTER STATION & TRANSACTION GRAPH
   -------------------------------------------------------------------------- */
export function TellerDeskSection({
  allAccounts,
  allTransactions,
  tellerGraphData,
  shiftStats,
  formatMoney,
  onTellerAction,
  onViewReceipt,
  onNavigate,
}) {
  const [search, setSearch] = useState('')
  const [accountTypeFilter, setAccountTypeFilter] = useState('ALL')

  const graphData = tellerGraphData || []

  const filteredAccounts = allAccounts.filter((acc) => {
    if (accountTypeFilter !== 'ALL' && acc.accountType !== accountTypeFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (acc.holderName || '').toLowerCase().includes(q) ||
      (acc.accountNumber || '').toLowerCase().includes(q)
    )
  })

  // Max daily volume for graph scaling
  const maxVolume = Math.max(...graphData.map((d) => Math.max(Number(d.deposits), Number(d.withdrawals))), 0)

  return (
    <div>
      {/* Teller Station Shift Hero */}
      <div className="teller-desk-hero">
        <div className="teller-hero-info">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(56,189,248,0.2)', border: '1px solid rgba(56,189,248,0.3)', padding: '3px 10px', borderRadius: '14px', fontSize: '11px', fontWeight: '700', color: '#7dd3fc', marginBottom: '10px' }}>
            <span className="pulse-dot-green" />
            <span>TELLER SERVICE DESK ACTIVE</span>
          </div>
          <h2>Branch Cash Counter & Customer Servicing</h2>
          <p>
            Verify customer identity, execute counter cash deposits, process instant cash withdrawals, and review weekly transaction volume trends.
          </p>
        </div>

        {/* Shift Stats Strip */}
        <div className="teller-shift-stats">
          <div className="teller-stat-item">
            <span className="teller-stat-label">Counter Inflows</span>
            <span className="teller-stat-val" style={{ color: '#34d399' }}>
              +{formatMoney(shiftStats.todayDeposits)}
            </span>
          </div>
          <div className="teller-stat-item">
            <span className="teller-stat-label">Cash Outflows</span>
            <span className="teller-stat-val" style={{ color: '#f43f5e' }}>
              -{formatMoney(shiftStats.todayWithdrawals)}
            </span>
          </div>
          <div className="teller-stat-item">
            <span className="teller-stat-label">Drawer Position</span>
            <span className="teller-stat-val">
              {formatMoney(shiftStats.netDrawer)}
            </span>
          </div>
          <div className="teller-stat-item">
            <span className="teller-stat-label">Customers Served</span>
            <span className="teller-stat-val" style={{ color: '#38bdf8' }}>
              {shiftStats.servedCount} Serviced
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Transaction Graph (Requested by User) */}
      <div className="teller-graph-card">
        <div className="teller-graph-header">
          <div>
            <h3>Weekly Counter Transaction Volume Flow</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Daily distribution of counter cash deposits vs cash withdrawals across branch operating days.
            </p>
          </div>

          <div className="teller-graph-legend">
            <div className="teller-legend-item">
              <span className="legend-box-deposit" />
              <span>Cash Deposits (Inflow)</span>
            </div>
            <div className="teller-legend-item">
              <span className="legend-box-withdraw" />
              <span>Cash Withdrawals (Outflow)</span>
            </div>
          </div>
        </div>

        {/* Chart Visualization Columns */}
        <div className="teller-chart-bars-wrap">
          {graphData.length ? graphData.map((dayData) => {
            const depHeight = maxVolume ? Math.round((Number(dayData.deposits) / maxVolume) * 120) : 0
            const wdrHeight = maxVolume ? Math.round((Number(dayData.withdrawals) / maxVolume) * 120) : 0
            return (
              <div className="chart-day-column" key={dayData.day}>
                <div className="chart-bars-pair">
                  <div
                    className="bar-pillar bar-deposit"
                    style={{ height: `${depHeight}px` }}
                    title={`${dayData.day} Deposits: ${money.format(Number(dayData.deposits))}`}
                  />
                  <div
                    className="bar-pillar bar-withdraw"
                    style={{ height: `${wdrHeight}px` }}
                    title={`${dayData.day} Withdrawals: ${money.format(Number(dayData.withdrawals))}`}
                  />
                </div>
                <span className="chart-day-label">{dayData.day}</span>
              </div>
            )
          }) : <p>No teller volume records are available.</p>}
        </div>

        <div className="teller-graph-footer">
          <div>
            <strong style={{ color: '#0f172a' }}>Weekly Volume:</strong>{' '}
            <span>{money.format(graphData.reduce((s, d) => s + Number(d.deposits) + Number(d.withdrawals), 0))} Total Cash Velocity</span>
          </div>
          <div>
            <strong style={{ color: '#059669' }}>Net Branch Inflow:</strong>{' '}
            <span>{money.format(graphData.reduce((s, d) => s + Number(d.deposits) - Number(d.withdrawals), 0))}</span>
          </div>
        </div>
      </div>

      {/* Customer Accounts Directory with Action Buttons */}
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>All Customer Accounts Directory & Quick Counter Actions</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Select any account holder below to execute instant cash deposits or counter cash withdrawals.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              {['ALL', 'SAVINGS', 'CURRENT'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAccountTypeFilter(t)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: accountTypeFilter === t ? '#ffffff' : 'transparent',
                    color: accountTypeFilter === t ? '#0f172a' : '#64748b',
                    boxShadow: accountTypeFilter === t ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
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
                placeholder="Search customer name, account no…"
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

        {/* Customer Accounts Grid */}
        <div style={{ padding: '20px' }}>
          <div className="teller-customers-grid">
            {filteredAccounts.map((acc) => (
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

                {/* Teller Action Buttons */}
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

      {/* Recent Teller Counter Operations Stream */}
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>Recent Counter Operations Audit</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Real-time feed of teller deposits and cash withdrawals processed at this station.
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => onNavigate('teller-history')}
          >
            <span>View Teller Logs</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="master-table">
            <thead>
              <tr>
                <th>Receipt Slip</th>
                <th>Action</th>
                <th>Customer / Account</th>
                <th>Amount</th>
                <th>Post Balance</th>
                <th>Time</th>
                <th>Advice</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions
                .filter((t) => t.type.includes('TELLER') || t.type === 'DEPOSIT' || t.type === 'WITHDRAWAL')
                .slice(0, 6)
                .map((tx) => {
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
                            background: isPositive ? '#ecfdf5' : '#fff1f2',
                            color: isPositive ? '#047857' : '#be123c',
                          }}
                        >
                          {isPositive ? 'TELLER DEPOSIT' : 'TELLER WITHDRAWAL'}
                        </span>
                      </td>
                      <td>
                        <strong>{tx.holderName || tx.accountNumber || tx.accountId.slice(-8)}</strong>
                      </td>
                      <td>
                        <strong style={{ color: isPositive ? '#059669' : '#e11d48' }}>
                          {isPositive ? '+' : ''}{formatMoney(tx.amount)}
                        </strong>
                      </td>
                      <td style={{ fontWeight: '600', color: '#0f172a' }}>
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
                          <span>Slip</span>
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
