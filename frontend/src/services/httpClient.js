const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || 'The request could not be completed.')
  return data
}