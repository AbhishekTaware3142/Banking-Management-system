import { ArrowRight, Banknote, Plus, Sliders, Zap } from 'lucide-react'

/* --------------------------------------------------------------------------
   VIEW 5: LOANS & CREDIT HUB WITH INTERACTIVE CALCULATOR
   -------------------------------------------------------------------------- */
export function LoansSection({
  loans,
  formatMoney,
  onApply,
  onPay,
  calcPrincipal,
  setCalcPrincipal,
  calcRate,
  setCalcRate,
  calcMonths,
  setCalcMonths,
}) {
  // Compute EMI live
  const monthlyRate = (calcRate / 100) / 12
  const computedEmi =
    monthlyRate === 0
      ? calcPrincipal / calcMonths
      : (calcPrincipal * monthlyRate * Math.pow(1 + monthlyRate, calcMonths)) /
      (Math.pow(1 + monthlyRate, calcMonths) - 1)
  const totalPayable = computedEmi * calcMonths
  const totalInterest = totalPayable - calcPrincipal

  return (
    <div className="loans-dashboard-grid">
      {/* Left: Active Loans list */}
      <div>
        <div className="content-card-panel" style={{ marginBottom: '20px' }}>
          <div className="panel-header-row">
            <div>
              <h2>Your Credit Facilities</h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Active amortized loans and repayment schedules
              </p>
            </div>
            <button type="button" className="btn-primary" onClick={onApply}>
              <Plus size={15} />
              <span>Apply for Loan</span>
            </button>
          </div>

          {loans.length > 0 ? (
            loans.map((loan) => {
              const progressPct = Math.min(
                100,
                Math.max(
                  0,
                  ((Number(loan.principal) - Number(loan.outstandingPrincipal)) /
                    Number(loan.principal)) *
                  100
                )
              )
              return (
                <div className="loan-card-item" key={loan.id}>
                  <div className="loan-item-top">
                    <div className={`loan-status-tag ${loan.status.toLowerCase()}`}>
                      <i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                      <span>{loan.status} FACILITY</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#2563eb' }}>
                      {loan.annualRatePercent}% p.a.
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>
                    Sanctioned Principal
                  </span>
                  <div className="loan-principal-stat">{formatMoney(loan.principal)}</div>

                  <div className="loan-progress-track">
                    <div className="loan-progress-fill" style={{ width: `${progressPct}%` }} />
                  </div>

                  <div className="loan-stats-grid">
                    <div>
                      <span>Monthly EMI</span>
                      <strong>{formatMoney(loan.emi)}</strong>
                    </div>
                    <div>
                      <span>Outstanding</span>
                      <strong>{formatMoney(loan.outstandingPrincipal)}</strong>
                    </div>
                    <div>
                      <span>Tenure Progress</span>
                      <strong>
                        {loan.paidInstallments} / {loan.termMonths} Months
                      </strong>
                    </div>
                  </div>

                  {loan.status === 'ACTIVE' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}
                      onClick={() => onPay(loan.id)}
                    >
                      <Zap size={15} />
                      <span>Pay Next EMI ({formatMoney(loan.emi)})</span>
                    </button>
                  )}
                </div>
              )
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b' }}>
              <Banknote size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
              <p>You have no active loans or credit lines.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Interactive Loan Calculator */}
      <div>
        <div className="loan-calc-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Sliders size={20} color="#2563eb" />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                Interactive EMI Simulator
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b' }}>Estimate installments in real time</p>
            </div>
          </div>

          {/* Slider 1: Principal */}
          <div className="calc-slider-group">
            <div className="calc-slider-header">
              <span>Loan Amount</span>
              <strong>₹{calcPrincipal.toLocaleString('en-IN')}</strong>
            </div>
            <input
              type="range"
              className="calc-range-input"
              min="10000"
              max="500000"
              step="5000"
              value={calcPrincipal}
              onChange={(e) => setCalcPrincipal(Number(e.target.value))}
            />
          </div>

          {/* Slider 2: Interest Rate */}
          <div className="calc-slider-group">
            <div className="calc-slider-header">
              <span>Annual Interest Rate</span>
              <strong>{calcRate}%</strong>
            </div>
            <input
              type="range"
              className="calc-range-input"
              min="0"
              max="18"
              step="0.25"
              value={calcRate}
              onChange={(e) => setCalcRate(Number(e.target.value))}
            />
          </div>

          {/* Slider 3: Term */}
          <div className="calc-slider-group">
            <div className="calc-slider-header">
              <span>Duration (Months)</span>
              <strong>{calcMonths} Months</strong>
            </div>
            <input
              type="range"
              className="calc-range-input"
              min="6"
              max="60"
              step="3"
              value={calcMonths}
              onChange={(e) => setCalcMonths(Number(e.target.value))}
            />
          </div>

          {/* Calculated Output Box */}
          <div className="calc-result-box">
            <div className="calc-result-row">
              <span>Principal Amount</span>
              <strong>₹{calcPrincipal.toLocaleString('en-IN')}</strong>
            </div>
            <div className="calc-result-row">
              <span>Total Interest Payable</span>
              <strong>₹{Math.round(totalInterest).toLocaleString('en-IN')}</strong>
            </div>
            <div className="calc-result-row highlight">
              <span>Estimated Monthly EMI</span>
              <strong>₹{Math.round(computedEmi).toLocaleString('en-IN')}/mo</strong>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={onApply}
          >
            <span>Proceed to Apply with These Terms</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
