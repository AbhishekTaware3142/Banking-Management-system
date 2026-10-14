export function mapUser(document) {
  if (!document) return null
  return {
    id: document.id ?? document._id,
    username: document.username,
    fullName: document.fullName,
    role: document.role || 'CUSTOMER',
  }
}