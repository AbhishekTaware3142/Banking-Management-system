import { Printer } from 'lucide-react'
import { dateTime } from '../../utils/formatters.js'

/* --------------------------------------------------------------------------
   EMPLOYEE / TELLER VIEW 3: TELLER COUNTER AUDIT HISTORY
   -------------------------------------------------------------------------- */
export function TellerHistorySection({ allTransactions, formatMoney, onViewReceipt }) {
  const counterTxs = allTransactions.filter(
    (t) => t.type.includes('TELLER') || t.type === 'DEPOSIT' || t.type === 'WITHDRAWAL'
  )

  return (
    <div>
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>Teller Desk Shift Audit Log</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Historical register of all cash movements processed at teller counter desks.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="master-table">
            <thead>
              <tr>
                <th>Receipt Number</th>
                <th>Operation</th>
                <th>Account / Holder</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Timestamp</th>
                <th>Official Voucher</th>
              </tr>
            </thead>
            <tbody>
              {counterTxs.map((tx) => {
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
                        {isPositive ? 'COUNTER DEPOSIT' : 'CASH WITHDRAWAL'}
                      </span>
                    </td>
                    <td>
                      <strong>{tx.holderName || tx.accountNumber || tx.accountId.slice(-8)}</strong>
                    </td>
                    <td>
                      <strong style={{ color: isPositive ? '#059669' : '#e11d48', fontSize: '14px' }}>
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
                        <span>Advice Slip</span>
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
