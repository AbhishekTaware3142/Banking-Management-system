import { mapAccount, mapAccounts } from '../models/Account.js'
import { request } from './httpClient.js'

export const accountService = {
  async list() {
    return mapAccounts(await request('/accounts'))
  },

  async create(details) {
    return mapAccount(await request('/accounts', {
      method: 'POST',
      body: JSON.stringify(details),
    }))
  },

  deposit(accountId, amount) {
    return request(`/accounts/${accountId}/deposits`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },

  withdraw(accountId, amount) {
    return request(`/accounts/${accountId}/withdrawals`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    })
  },
}