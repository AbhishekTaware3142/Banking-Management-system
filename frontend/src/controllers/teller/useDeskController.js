/**
 * useDeskController
 * Controller for the Teller Counter Station section.
 * Handles teller deposit / withdrawal actions (cash counter ops),
 * updates shift stats and bank stats, and manages the teller action modal.
 */
import { useState } from 'react'
import { adminService } from '../../services/adminService.js'
import { money } from '../../utils/formatters.js'

/**
 * @param {object} params
 * @param {Array}    params.allTransactions
 * @param {Function} params.showToast
 * @param {Function} params.fetchStaffData     - refreshes staff-wide data from API
 * @param {Function} params.refreshAll         - refreshes customer accounts + txns
 * @param {Function} params.setSubmitting
 * @param {Function} params.setError
 */
export function useDeskController({
  allTransactions,
  showToast,
  fetchStaffData,
  refreshAll,
  setSubmitting,
  setError,
}) {
  const [tellerModal, setTellerModal] = useState(null)
  const [tellerGraphData, setTellerGraphData] = useState([])
  const [today] = useState(() => new Date().toDateString())
  const todayTransactions = allTransactions.filter((transaction) =>
    transaction.type?.startsWith('TELLER_') &&
    new Date(transaction.createdAt).toDateString() === today
  )
  const todayDeposits = todayTransactions
    .filter((transaction) => transaction.type === 'TELLER_DEPOSIT')
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0)
  const todayWithdrawals = todayTransactions
    .filter((transaction) => transaction.type === 'TELLER_WITHDRAWAL')
    .reduce((total, transaction) => total + Math.abs(Number(transaction.amount || 0)), 0)
  const tellerShiftStats = {
    todayDeposits,
    todayWithdrawals,
    netDrawer: todayDeposits - todayWithdrawals,
    servedCount: todayTransactions.length,
  }

  function openTellerModal(type, acc) {
    setTellerModal({ type, account: acc })
  }

  function closeTellerModal() {
    setTellerModal(null)
  }

  async function handleTellerSubmit(event) {
    event.preventDefault()
    if (!tellerModal?.account) return
    setSubmitting(true)
    setError('')

    const fields = Object.fromEntries(new FormData(event.currentTarget))
    const amt = Number(fields.amount)
    const targetAcc = tellerModal.account
    const isDeposit = tellerModal.type === 'DEPOSIT'
    try {
      if (!amt || amt <= 0) {
        throw new Error('Please specify a valid amount greater than zero.')
      }
      if (!isDeposit && amt > Number(targetAcc.balance || 0)) {
        throw new Error(
          `Insufficient customer balance! Maximum withdrawable is ${money.format(targetAcc.balance)}`
        )
      }

      if (isDeposit) await adminService.tellerDeposit(targetAcc.id, amt)
      else await adminService.tellerWithdrawal(targetAcc.id, amt)
      await fetchStaffData()
      await refreshAll()
      setTellerModal(null)
      showToast(
        `Teller ${isDeposit ? 'Deposit' : 'Withdrawal'} of ${money.format(amt)} processed successfully!`
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    tellerModal,
    tellerShiftStats,
    tellerGraphData,
    setTellerGraphData,
    openTellerModal,
    closeTellerModal,
    handleTellerSubmit,
  }
}
