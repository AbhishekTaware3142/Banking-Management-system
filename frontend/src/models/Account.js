export function mapAccount(document) {
  if (!document) return null
  return {
    ...document,
    id: document.id ?? document._id,
    balance: Number(document.balance || 0),
  }
}

export function mapAccounts(documents = []) {
  return documents.map(mapAccount).filter(Boolean)
}