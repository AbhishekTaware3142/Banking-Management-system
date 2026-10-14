/**
 * useAccountsController
 * Controller for the Customer Accounts & Cards section.
 * Handles account creation and account selection.
 */
import { accountService } from '../../services/accountService.js'

/**
 * @param {object} params
 * @param {string}   params.accountId       - currently selected account id
 * @param {Function} params.setAccountId
 * @param {Function} params.showToast
 * @param {Function} params.setModal
 * @param {Function} params.setSubmitting
 * @param {Function} params.setError
 * @param {Function} params.refreshAll      - refreshes accounts + transactions
 */
export function useAccountsController({
  setAccountId,
  showToast,
  setModal,
  setSubmitting,
  setError,
  refreshAll,
}) {
  async function createAccount(fields) {
    setSubmitting(true)
    setError('')
    try {
      const created = await accountService.create(fields)
      await refreshAll()
      setAccountId(created.id)
      showToast(`Account ${created.accountNumber} opened successfully!`)
      setModal(null)
    } catch (err) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return { createAccount }
}
