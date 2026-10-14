import { useState } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, Banknote, Clock3, Landmark, Sparkles, TrendingUp } from 'lucide-react'
import { TransactionTableView } from '../../components/TransactionTableView.jsx'

/* --------------------------------------------------------------------------
   VIEW 1: OVERVIEW COMPONENT
   -------------------------------------------------------------------------- */
export function OverviewSection({
  account,
  transactions,
  activeLoans,
  formatMoney,
  totalInflows,
  totalOutflows,
  onAction,
  onNavigate,
  onViewReceipt,
  readOnly = false,
}) {
  const statement = transactions ?? []
  const [currentMonth] = useState(() => {
    const month = new Date()
    month.setDate(1)
    return month
  })
  const cashFlowMonths = Array.from({ length: 6 }, (_, index) => {
    const month = new Date(currentMonth)
    month.setMonth(month.getMonth() - (5 - index))
    const monthTransactions = statement.filter((transaction) => {
      const createdAt = new Date(transaction.createdAt)
      return createdAt.getFullYear() === month.getFullYear() && createdAt.getMonth() === month.getMonth()
    })
    return {
      month: month.toLocaleDateString('en-IN', { month: 'short' }),
      inflows: monthTransactions
        .filter((transaction) => ['DEPOSIT', 'LOAN_DISBURSEMENT'].includes(transaction.type))
        .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0),
      outflows: monthTransactions
        .filter((transaction) => ['WITHDRAWAL', 'EMI_PAYMENT'].includes(transaction.type))
        .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0),
    }
  })
  const maxCashFlow = Math.max(...cashFlowMonths.flatMap((month) => [month.inflows, month.outflows]), 0)
  const sixMonthInflows = cashFlowMonths.reduce((total, month) => total + month.inflows, 0)
  const sixMonthOutflows = cashFlowMonths.reduce((total, month) => total + month.outflows, 0)
  const outstandingLoans = activeLoans.reduce((total, loan) => total + Number(loan.outstandingPrincipal || 0), 0)
  return (
    <>
      <section className="dashboard-hero-grid">
        {/* Balance Master Card */}
        <div className="balance-master-card">
          <div className="balance-card-header">
            <div className="balance-account-tag">
              <Sparkles size={13} />
              <span>{account.accountType} PRIVILEGE ACCOUNT</span>
            </div>
            <span className="balance-account-number">{account.accountNumber}</span>
          </div>

          <div className="balance-amount-box">
            <span className="balance-label">Total Liquid Balance</span>
            <div className="balance-headline">
              <span>{formatMoney(account.balance)}</span>
            </div>
          </div>

          {!readOnly && <div className="balance-actions-dock">
            <button
              type="button"
              className="quick-action-pill"
              onClick={() => onAction('deposit')}
            >
              <ArrowDownLeft size={18} />
              <span>Deposit</span>
            </button>
            <button
              type="button"
              className="quick-action-pill"
              onClick={() => onAction('withdraw')}
            >
              <ArrowUpRight size={18} />
              <span>Withdraw</span>
            </button>
            <button
              type="button"
              className="quick-action-pill"
              onClick={() => onAction('loan')}
            >
              <Banknote size={18} />
              <span>Credit Line</span>
            </button>
          </div>}
        </div>

        <div className="content-card-panel">
          <div className="panel-header-row">
            <h2>Account Details</h2>
          </div>
          <dl style={{ display: 'grid', gap: '16px', margin: 0 }}>
            <div>
              <dt style={{ color: '#64748b', fontSize: '12px' }}>Account holder</dt>
              <dd style={{ margin: '4px 0 0', fontWeight: '700' }}>{account.holderName}</dd>
            </div>
            <div>
              <dt style={{ color: '#64748b', fontSize: '12px' }}>Account type</dt>
              <dd style={{ margin: '4px 0 0', fontWeight: '700' }}>{account.accountType}</dd>
            </div>
            <div>
              <dt style={{ color: '#64748b', fontSize: '12px' }}>Opened</dt>
              <dd style={{ margin: '4px 0 0', fontWeight: '700' }}>
                {account.openedAt ? new Date(account.openedAt).toLocaleDateString('en-IN') : 'Not provided'}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Financial Metrics Row */}
      <section className="metrics-row">
        <div className="metric-card">
          <div className="metric-icon-box green">
            <ArrowDownLeft size={22} />
          </div>
          <div className="metric-body">
            <span>Monthly Inflows</span>
            <strong>{formatMoney(totalInflows)}</strong>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box red">
            <ArrowUpRight size={22} />
          </div>
          <div className="metric-body">
            <span>Monthly Outflows</span>
            <strong>{formatMoney(totalOutflows)}</strong>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box blue">
            <Landmark size={22} />
          </div>
          <div className="metric-body">
            <span>Active Credit Facilities</span>
            <strong>{activeLoans.length} Loans Active</strong>
          </div>
        </div>
      </section>

      {/* Analytics & Credit Standing Grid */}
      <section className="analytics-grid-two-col">
        {/* Cash Flow Visualizer Panel */}
        <div className="cashflow-panel">
          <div className="cashflow-header">
            <div className="cashflow-header-titles">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#2563eb" />
                <h3>Monthly Cash Flow Analytics</h3>
              </div>
              <p>Rolling 6-month comparison of total credits versus debits</p>
            </div>
            <div className="cashflow-legend">
              <div><span className="legend-indicator legend-inflow" />Inflow</div>
              <div><span className="legend-indicator legend-outflow" />Outflow</div>
            </div>
          </div>

          <div className="cashflow-chart-container">
            {maxCashFlow > 0 ? cashFlowMonths.map((month) => (
              <div key={month.month} className="chart-month-column">
                <div className="chart-bars-wrap">
                  <div className="chart-bar inflow" style={{ height: `${(month.inflows / maxCashFlow) * 100}%` }} />
                  <div className="chart-bar outflow" style={{ height: `${(month.outflows / maxCashFlow) * 100}%` }} />
                </div>
                <span className="chart-month-label">{month.month}</span>
              </div>
            )) : <p>No cash flow records are available for the last six months.</p>}
          </div>

          <div className="cashflow-footer-stats">
            <div className="cf-stat-item">
              <span>Average Monthly Inflow</span>
              <strong>{formatMoney(sixMonthInflows / 6)}</strong>
            </div>
            <div className="cf-stat-item">
              <span>Six-Month Net Cash Flow</span>
              <strong style={{ color: '#10b981' }}>{formatMoney(sixMonthInflows - sixMonthOutflows)}</strong>
            </div>
            <div className="cf-stat-item">
              <span>Average Monthly Outflow</span>
              <strong style={{ color: '#2563eb' }}>{formatMoney(sixMonthOutflows / 6)}</strong>
            </div>
          </div>
        </div>

        {/* Loan totals from the account API */}
        <div className="health-score-panel">
          <div>
            <div className="health-score-badge-row">
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Loan Overview
              </span>
            </div>

            <div className="health-score-dial">
              <div className="health-score-number">{activeLoans.length}</div>
              <span className="health-score-rating">Active loans</span>
            </div>

            <p style={{ color: '#64748b', fontSize: '12px' }}>Totals reflect loan records returned by the banking API.</p>
          </div>

          <div className="health-score-breakdown">
            <div className="health-row-item">
              <span>Outstanding principal</span>
              <strong>{formatMoney(outstandingLoans)}</strong>
            </div>
            <div className="health-row-item">
              <span>Statement inflows</span>
              <strong>{formatMoney(totalInflows)}</strong>
            </div>
            <div className="health-row-item">
              <span>Statement outflows</span>
              <strong>{formatMoney(totalOutflows)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Table Panel */}
      <section className="content-card-panel">
        <div className="panel-header-row">
          <div>
            <h2>Recent Activity Timeline</h2>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Real-time ledger updates for account {account.accountNumber}
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onNavigate('activity')}
          >
            <span>View Full Statement</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {transactions.length > 0 ? (
          <TransactionTableView
            transactions={transactions.slice(0, 5)}
            formatMoney={formatMoney}
            onViewReceipt={onViewReceipt}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b' }}>
            <Clock3 size={28} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
            <p>No recent activity on this account yet.</p>
          </div>
        )}
      </section>
    </>
  )
}
