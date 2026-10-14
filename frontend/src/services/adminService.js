import { mapAccounts } from '../models/Account.js'
import { mapLoans } from '../models/Loan.js'
import { mapTransactions } from '../models/Transaction.js'
import { request } from './httpClient.js'

export const adminService = {
  overview: () => request('/staff/overview'),
  async accounts() {
    return mapAccounts(await request('/staff/accounts'))
  },
  async transactions() {
    return mapTransactions(await request('/staff/transactions'))
  },
  async loans() {
    return mapLoans(await request('/staff/loans'))
  },
  graph: () => request('/staff/graph'),
  employees: () => request('/admin/employees'),
  createEmployee(details) {
    return request('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(details),
    })
  },
  tellerDeposit(accountId, amount) {
    return request(`/staff/accounts/${accountId}/deposits`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
  tellerWithdrawal(accountId, amount) {
    return request(`/staff/accounts/${accountId}/withdrawals`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
}