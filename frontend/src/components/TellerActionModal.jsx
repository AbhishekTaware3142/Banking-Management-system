import { useState } from 'react'
import { ArrowRight, ArrowUpRight, CircleAlert, Plus, X } from 'lucide-react'

/* --------------------------------------------------------------------------
   TELLER ACTION MODAL (DEPOSIT CASH / WITHDRAW CASH FOR CUSTOMER)
   -------------------------------------------------------------------------- */
export function TellerActionModal({ modal, onClose, onSubmit, submitting, error, formatMoney }) {
  const [amountVal, setAmountVal] = useState('')
  const targetAcc = modal?.account
  const isDeposit = modal?.type === 'DEPOSIT'

  const currentBal = Number(targetAcc?.balance || 0)
  const enteredAmount = Number(amountVal || 0)
  const isOverdraft = !isDeposit && enteredAmount > currentBal
  const previewBal = isDeposit ? currentBal + enteredAmount : currentBal - enteredAmount

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog-box" style={{ maxWidth: '460px' }}>
        <div className="modal-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isDeposit ? '#ecfdf5' : '#fff1f2',
                color: isDeposit ? '#059669' : '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDeposit ? <Plus size={18} /> : <ArrowUpRight size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                Teller Counter: {isDeposit ? 'Deposit Cash' : 'Withdraw Cash'}
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Operations Counter Desk</span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Customer Account Details Card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px',
            margin: '16px 20px 0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{targetAcc?.holderName}</strong>
              <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                {targetAcc?.accountNumber} · {targetAcc?.accountType}
              </div>
            </div>
            <span
              style={{
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '700',
                background: '#ecfdf5',
                color: '#047857',
              }}
            >
              Verified KYC
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Current Customer Balance:</span>
            <strong style={{ fontSize: '16px', color: '#0f172a' }}>{formatMoney(currentBal)}</strong>
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: '12px 20px 0',
              padding: '10px 14px',
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              color: '#e11d48',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CircleAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {isOverdraft && (
          <div
            style={{
              margin: '12px 20px 0',
              padding: '10px 14px',
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              color: '#e11d48',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CircleAlert size={16} />
            <span><strong>Insufficient Funds:</strong> Overdraft exceeds available balance of {formatMoney(currentBal)}.</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="modal-form">
          <div className="modal-field">
            <label htmlFor="teller-amount">
              {isDeposit ? 'Deposit Cash Amount (INR)' : 'Withdraw Cash Amount (INR)'}
            </label>
            <div className="modal-input-wrap">
              <span className="modal-input-currency">₹</span>
              <input
                id="teller-amount"
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

          {/* Quick preset chips */}
          <div className="preset-chips-row">
            {[1000, 5000, 10000, 25000, 50000].map((amt) => (
              <button
                key={amt}
                type="button"
                className="preset-chip-btn"
                onClick={() => setAmountVal(String(amt))}
              >
                +₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div className="modal-field">
            <label htmlFor="teller-description">Teller Counter Narration (Optional)</label>
            <div className="modal-input-wrap">
              <input
                id="teller-description"
                name="description"
                placeholder={
                  isDeposit
                    ? 'Add a deposit note'
                    : 'Add a withdrawal note'
                }
              />
            </div>
          </div>

          {/* Real-Time Balance Preview Box */}
          {enteredAmount > 0 && !isOverdraft && (
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
              }}
            >
              <span style={{ color: '#64748b' }}>Balance After Transaction:</span>
              <strong style={{ color: isDeposit ? '#059669' : '#0f172a', fontSize: '14px' }}>
                {formatMoney(previewBal)}
              </strong>
            </div>
          )}

          <div className="modal-actions-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || isOverdraft || enteredAmount <= 0}
              style={{
                background: isDeposit
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              }}
            >
              {submitting
                ? 'Processing…'
                : isDeposit
                  ? 'Confirm Counter Deposit'
                  : 'Dispense Cash & Withdraw'}
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
