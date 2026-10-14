import { mapLoans } from '../models/Loan.js'
import { request } from './httpClient.js'

export const loanService = {
  async forAccount(accountId) {
    return mapLoans(await request(`/accounts/${accountId}/loans`))
  },

  async apply(accountId, terms) {
    return request(`/accounts/${accountId}/loans`, {
      method: 'POST',
      body: JSON.stringify(terms),
    })
  },

  payInstallment(accountId, loanId) {
    return request(`/accounts/${accountId}/loans/${loanId}/payments`, { method: 'POST' })
  },
}