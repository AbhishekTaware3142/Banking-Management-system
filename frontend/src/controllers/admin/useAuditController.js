/**
 * useAuditController
 * Controller for the Admin Global Audit Ledger section.
 * Manages receipt modal for audit transactions.
 */

/**
 * @param {object} params
 * @param {Function} params.setReceiptTx
 * @param {Function} params.setModal
 */
export function useAuditController({ setReceiptTx, setModal }) {
  function viewReceipt(tx) {
    setReceiptTx(tx)
    setModal('receipt')
  }

  return { viewReceipt }
}
