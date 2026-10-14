/**
 * useHistoryController
 * Controller for the Teller Counter Audit History section.
 * Manages receipt modal for teller transactions.
 */

/**
 * @param {object} params
 * @param {Function} params.setReceiptTx
 * @param {Function} params.setModal
 */
export function useHistoryController({ setReceiptTx, setModal }) {
  function viewReceipt(tx) {
    setReceiptTx(tx)
    setModal('receipt')
  }

  return { viewReceipt }
}
