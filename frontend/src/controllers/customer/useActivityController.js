/**
 * useActivityController
 * Controller for the Customer Statements / Activity section.
 * Manages transaction filtering, search, and CSV export.
 */
import { useState } from 'react'
import { dateTime } from '../../utils/formatters.js'

/**
 * @param {object} params
 * @param {Array}    params.transactions     - full (unfiltered) transaction list
 * @param {object}   params.account          - currently selected account
 * @param {Function} params.showToast
 */
export function useActivityController({ transactions, account, showToast }) {
  const [activityFilter, setActivityFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTransactions = transactions.filter((tx) => {
    if (activityFilter === 'DEPOSITS' && !['DEPOSIT', 'LOAN_DISBURSEMENT'].includes(tx.type)) return false
    if (activityFilter === 'WITHDRAWALS' && tx.type !== 'WITHDRAWAL') return false
    if (activityFilter === 'LOANS' && !['LOAN_DISBURSEMENT', 'EMI_PAYMENT'].includes(tx.type)) return false
    if (activityFilter === 'EMI' && tx.type !== 'EMI_PAYMENT') return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const desc = (tx.description || '').toLowerCase()
      const typ = (tx.type || '').toLowerCase()
      const amt = String(tx.amount || '')
      return desc.includes(q) || typ.includes(q) || amt.includes(q)
    }
    return true
  })

  function exportStatement() {
    const rows = [
      ['Date & Time', 'Transaction Type', 'Description', 'Amount (INR)', 'Running Balance (INR)'],
      ...transactions.map((item) => [
        dateTime.format(new Date(item.createdAt)),
        item.type,
        item.description,
        item.amount,
        item.balanceAfter,
      ]),
    ]
    const csv = rows
      .map((row) => row.map((val) => `"${String(val ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Statement-${account?.accountNumber || 'apex'}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    showToast('Account statement exported to CSV.')
  }

  return {
    activityFilter,
    setActivityFilter,
    searchQuery,
    setSearchQuery,
    filteredTransactions,
    exportStatement,
  }
}
