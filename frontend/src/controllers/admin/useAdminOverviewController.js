/**
 * useAdminOverviewController
 * Controller for the Admin Treasury & Reserves overview section.
 * Handles navigation to other admin views.
 */

/**
 * @param {object} params
 * @param {Function} params.setView
 */
export function useAdminOverviewController({ setView }) {
  function navigateTo(view) {
    setView(view)
  }

  return { navigateTo }
}
