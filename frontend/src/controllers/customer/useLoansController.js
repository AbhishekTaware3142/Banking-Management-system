/**
 * useLoansController
 * Controller for the Customer Loans & EMI section.
 * Handles loan application, EMI payment, and EMI calculator state.
 */
import { useState } from 'react'
import { loanService } from '../../services/loanService.js'

/**
 * @param {object} params
 * @param {string}   params.accountId
 * @param {Function} params.showToast
 * @param {Function} params.setModal
 * @param {Function} params.setSubmitting
 * @param {Function} params.setError
 * @param {Function} params.refreshAll
 */
export function useLoansController({
  accountId,
  showToast,
  setModal,
  setSubmitting,
  setError,
  refreshAll,
}) {
  const [calcPrincipal, setCalcPrincipal] = useState(10000)
  const [calcRate, setCalcRate] = useState(0)
  const [calcMonths, setCalcMonths] = useState(6)

  async function applyLoan(fields) {
    setSubmitting(true)
    setError('')
    const principal = Number(fields.principal)
    const annualRatePercent = Number(fields.annualRatePercent)
    const termMonths = Number(fields.termMonths)

    try {
      await loanService.apply(accountId, { principal, annualRatePercent, termMonths })
      await refreshAll()
      showToast('Loan application submitted.')
      setModal(null)
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function payEmi(loanId) {
    setError('')
    try {
      await loanService.payInstallment(accountId, loanId)
      await refreshAll()
      showToast('Monthly EMI payment processed.')
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    }
  }

  return {
    calcPrincipal,
    setCalcPrincipal,
    calcRate,
    setCalcRate,
    calcMonths,
    setCalcMonths,
    applyLoan,
    payEmi,
  }
}
