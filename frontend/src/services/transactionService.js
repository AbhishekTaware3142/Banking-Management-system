import { mapTransactions } from '../models/Transaction.js'
import { request } from './httpClient.js'

export const transactionService = {
  async statement(accountId) {
    return mapTransactions(await request(`/accounts/${accountId}/statement`))
  },
}