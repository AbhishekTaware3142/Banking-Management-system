import { ArrowDownLeft, ArrowUpRight, FileText, Landmark } from 'lucide-react'
import { dateTime } from '../utils/formatters.js'

/* --------------------------------------------------------------------------
   TABLE VIEW REUSABLE COMPONENT
   -------------------------------------------------------------------------- */
export function TransactionTableView({ transactions, formatMoney, onViewReceipt }) {
  return (
    <div className="table-responsive">
      <table className="modern-banking-table">
        <thead>
          <tr>
            <th>Transaction Details</th>
            <th>Type</th>
            <th>Timestamp</th>
            <th>Amount (INR)</th>
            <th>Running Balance</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isPositive = ['DEPOSIT', 'LOAN_DISBURSEMENT'].includes(tx.type)
            return (
              <tr key={tx.id}>
                <td>
                  <div className="transaction-primary-cell">
                    <div
                      className={`tx-type-avatar ${tx.type === 'LOAN_DISBURSEMENT'
                          ? 'loan'
                          : isPositive
                            ? 'inflow'
                            : 'outflow'
                        }`}
                    >
                      {tx.type === 'LOAN_DISBURSEMENT' ? (
                        <Landmark size={18} />
                      ) : isPositive ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>
                    <div className="tx-title-box">
                      <strong>{tx.description || tx.type.replaceAll('_', ' ')}</strong>
                      <small>Ref: {tx.id.slice(-6).toUpperCase()}</small>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: isPositive ? '#ecfdf5' : '#f8fafc',
                      color: isPositive ? '#059669' : '#475569',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {tx.type.replaceAll('_', ' ')}
                  </span>
                </td>

                <td style={{ fontSize: '12px', color: '#64748b' }}>
                  {dateTime.format(new Date(tx.createdAt))}
                </td>

                <td>
                  <span className={`tx-amount ${isPositive ? 'inflow' : 'outflow'}`}>
                    {isPositive ? '+' : '−'}
                    {formatMoney(tx.amount)}
                  </span>
                </td>

                <td>
                  <span className="tx-balance-badge">{formatMoney(tx.balanceAfter)}</span>
                </td>

                <td>
                  <button
                    type="button"
                    onClick={() => onViewReceipt(tx)}
                    title="View e-Receipt"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#0f172a',
                      fontSize: '11px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <FileText size={13} />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
