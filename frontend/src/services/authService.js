import { mapUser } from '../models/User.js'
import { request } from './httpClient.js'

export const authService = {
  async currentUser() {
    return mapUser(await request('/auth/me'))
  },

  async login(credentials) {
    return mapUser(await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }))
  },

  async register(details) {
    return mapUser(await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    }))
  },

  logout() {
    return request('/auth/logout', { method: 'POST' })
  },
}