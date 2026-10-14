/**
 * useOverviewController
 * Controller for the Customer Overview / Dashboard section.
 * Derives display values from account API data.
 */
export function useOverviewController({ transactions, loans }) {
  const displayedTransactions = transactions ?? []
  const displayedLoans = loans ?? []
  const activeLoans = displayedLoans.filter((loan) => loan.status === 'ACTIVE')

  const totalInflows = displayedTransactions
    .filter((t) => ['DEPOSIT', 'LOAN_DISBURSEMENT'].includes(t.type))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  const totalOutflows = displayedTransactions
    .filter((t) => ['WITHDRAWAL', 'EMI_PAYMENT'].includes(t.type))
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  return {
    activeLoans,
    totalInflows,
    totalOutflows,
  }
}
