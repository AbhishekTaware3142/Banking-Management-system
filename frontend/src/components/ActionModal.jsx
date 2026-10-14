import { useState } from 'react'
import { ArrowRight, CheckCircle2, Printer, X } from 'lucide-react'
import { dateTime, money } from '../utils/formatters.js'

/* --------------------------------------------------------------------------
   ACTION MODALS
   -------------------------------------------------------------------------- */
export function ActionModal({
  type,
  account,
  receiptTx,
  calcPrincipal,
  calcRate,
  calcMonths,
  onClose,
  onSubmit,
  submitting,
}) {
  const [amountVal, setAmountVal] = useState('')

  if (type === 'receipt' && receiptTx) {
    return (
      <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-dialog-box" style={{ maxWidth: '440px' }}>
          <div className="modal-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} color="#10b981" />
              <h3>Official e-Receipt</h3>
            </div>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              padding: '24px 20px',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              marginBottom: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <strong style={{ fontSize: '15px', color: '#0f172a', fontFamily: 'var(--font-sans)' }}>
                Demo Bank PRIVATE BANK
              </strong>
              <div style={{ color: '#64748b', fontSize: '10px' }}>TRANSACTION ADVICE RECORD</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Reference No:</span>
              <strong style={{ color: '#0f172a' }}>{receiptTx.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Timestamp:</span>
              <strong style={{ color: '#0f172a' }}>{dateTime.format(new Date(receiptTx.createdAt))}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Type:</span>
              <strong style={{ color: '#0f172a' }}>{receiptTx.type}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Description:</span>
              <strong style={{ color: '#0f172a' }}>{receiptTx.description || 'Account Movement'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 6px', fontSize: '14px' }}>
              <span style={{ color: '#0f172a', fontWeight: '700' }}>Amount:</span>
              <strong style={{ color: '#2563eb' }}>{money.format(receiptTx.amount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#64748b' }}>Balance After:</span>
              <strong style={{ color: '#0f172a' }}>{money.format(receiptTx.balanceAfter)}</strong>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px', color: '#10b981', fontWeight: '700', fontSize: '11px' }}>
              ✔ STATUS: COMPLETED & RECONCILED
            </div>
          </div>

          <div className="modal-actions-footer">
            <button type="button" className="btn-secondary" onClick={() => window.print()}>
              <Printer size={15} />
              <span>Print Advice</span>
            </button>
            <button type="button" className="btn-primary" onClick={onClose}>
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const titles = {
    account: 'Open New Banking Account',
    deposit: 'Deposit Funds to Account',
    withdraw: 'Withdraw Cash from Account',
    loan: 'Apply for Credit Line',
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog-box">
        <div className="modal-head">
          <h3>{titles[type]}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-form">
          {type === 'account' ? (
            <>
              <div className="modal-field">
                <label htmlFor="holderName">Account Holder Legal Name</label>
                <div className="modal-input-wrap">
                  <input
                    id="holderName"
                    name="holderName"
                    placeholder="Full legal name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    defaultValue={account?.holderName || ''}
                  />
                </div>
              </div>

              <div className="modal-field">
                <label htmlFor="accountType">Account Classification</label>
                <div className="modal-input-wrap">
                  <select id="accountType" name="accountType" defaultValue="SAVINGS">
                    <option value="SAVINGS">Savings Account</option>
                    <option value="CURRENT">Current Account</option>
                  </select>
                </div>
              </div>
            </>
          ) : type === 'loan' ? (
            <>
              <div className="modal-field">
                <label htmlFor="principal">Required Principal Amount</label>
                <div className="modal-input-wrap">
                  <span className="modal-input-currency">₹</span>
                  <input
                    id="principal"
                    name="principal"
                    type="number"
                    min="1000"
                    step="0.01"
                    placeholder="Enter principal amount"
                    className="with-currency"
                    defaultValue={calcPrincipal}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="modal-field">
                  <label htmlFor="annualRatePercent">Annual Interest Rate (%)</label>
                  <div className="modal-input-wrap">
                    <input
                      id="annualRatePercent"
                      name="annualRatePercent"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      defaultValue={calcRate}
                      required
                    />
                  </div>
                </div>

                <div className="modal-field">
                  <label htmlFor="termMonths">Tenure (Months)</label>
                  <div className="modal-input-wrap">
                    <input
                      id="termMonths"
                      name="termMonths"
                      type="number"
                      min="1"
                      max="360"
                      step="1"
                      defaultValue={calcMonths}
                      required
                    />
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '11px', color: '#64748b' }}>
                Funds are immediately credited to account {account?.accountNumber} upon submission.
              </p>
            </>
          ) : (
            <>
              <div className="modal-field">
                <label htmlFor="amount">
                  {type === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'}
                </label>
                <div className="modal-input-wrap">
                  <span className="modal-input-currency">₹</span>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    className="with-currency"
                    required
                    autoFocus
                    value={amountVal}
                    onChange={(e) => setAmountVal(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-field">
                <label htmlFor="description">Narration (Optional)</label>
                <div className="modal-input-wrap">
                  <input
                    id="description"
                    name="description"
                    placeholder={
                      type === 'deposit'
                        ? 'Add a deposit note'
                        : 'Add a withdrawal note'
                    }
                  />
                </div>
              </div>
            </>
          )}

          <div className="modal-actions-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? 'Processing…'
                : type === 'account'
                  ? 'Open Account'
                  : type === 'loan'
                      ? 'Disburse Loan'
                      : type === 'deposit'
                        ? 'Deposit Funds'
                        : 'Confirm Withdrawal'}
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
