import { useState } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, FileText, Landmark, Search, X } from 'lucide-react'
import { dateTime } from '../../utils/formatters.js'

/* --------------------------------------------------------------------------
   ADMIN VIEW 1: EXECUTIVE TREASURY & BANK-WIDE OVERVIEW
   -------------------------------------------------------------------------- */
export function AdminOverviewSection({ bankStats, allAccounts, allTransactions, formatMoney, onNavigate }) {
  const [search, setSearch] = useState('')

  if (!bankStats) {
    return <p role="status">Bank summary is not available from the API.</p>
  }

  const filteredAccounts = allAccounts.filter((acc) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (acc.holderName || '').toLowerCase().includes(q) ||
      (acc.accountNumber || '').toLowerCase().includes(q) ||
      (acc.accountType || '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      {/* Executive Metric Cards */}
      <div className="admin-stats-grid">
        {/* Metric 1: Total Money in Bank / Vault */}
        <div className="admin-metric-card card-vault">
          <div className="admin-metric-top">
            <span className="admin-metric-label">All Money in Bank (Vault Reserves)</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Landmark size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{formatMoney(bankStats.totalVaultBalance)}</div>
          <div className="admin-metric-sub">
            <span>{bankStats.totalAccounts} accounts</span>
            <span>Vault liquid balance</span>
          </div>
        </div>

        {/* Metric 2: Total Customer Deposits */}
        <div className="admin-metric-card card-deposits">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Total Customer Deposits</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <ArrowDownLeft size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{formatMoney(bankStats.totalDeposits)}</div>
          <div className="admin-metric-sub">
            <span>{bankStats.totalCustomers} customers</span>
            <span>Cumulative Inflows</span>
          </div>
        </div>

        {/* Metric 3: Total Money Withdrawn */}
        <div className="admin-metric-card card-withdrawals">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Total Withdrawals Processed</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#fff1f2', color: '#e11d48' }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{formatMoney(bankStats.totalWithdrawals)}</div>
          <div className="admin-metric-sub">
            <span>{bankStats.totalTransactions} transactions</span>
            <span>ATM, Wire & Teller Outflows</span>
          </div>
        </div>

        {/* Metric 4: Total Loan Portfolio */}
        <div className="admin-metric-card card-loans">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Loan Portfolio & Disbursed</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <FileText size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{formatMoney(bankStats.totalLoanPrincipal)}</div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-purple">Outstanding: {formatMoney(bankStats.totalOutstandingLoans)}</span>
            <span>Bank-reported loan totals</span>
          </div>
        </div>
      </div>

      {/* Master Customer Accounts Directory */}
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>All Customer Accounts Directory ({filteredAccounts.length} Total)</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Institution-wide customer ledger with live balances and compliance verification.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="search-box-container">
              <Search size={14} color="#64748b" />
              <input
                type="text"
                placeholder="Search name, account no…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="search-clear-btn" onClick={() => setSearch('')}>
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => onNavigate('admin-accounts')}
            >
              <span>View Full Directory</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="master-table">
            <thead>
              <tr>
                <th>Customer Legal Name</th>
                <th>Account Number</th>
                <th>Account Classification</th>
                <th>Available Balance</th>
                <th>Opened Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.slice(0, 6).map((acc) => (
                <tr key={acc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="account-pill-avatar" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                        {acc.holderName ? acc.holderName.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <strong>{acc.holderName}</strong>
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
                    <strong style={{ fontSize: '14px', color: '#0f172a' }}>{formatMoney(acc.balance)}</strong>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '12px' }}>
                    {acc.openedAt ? dateTime.format(new Date(acc.openedAt)) : 'Not provided'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Bank Audit Ledger Snapshot */}
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>Global Bank Transaction Ledger Snapshot</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Immutable real-time audit ledger across all customer deposits, teller withdrawals and loan facilities.
            </p>
          </div>

          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => onNavigate('admin-audit')}
          >
            <span>View Complete Ledger</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="master-table">
            <thead>
              <tr>
                <th>Transaction Reference</th>
                <th>Operation Type</th>
                <th>Description / Slip</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {allTransactions.slice(0, 6).map((tx) => {
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
                      {tx.description || 'Depository Transaction'}
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
