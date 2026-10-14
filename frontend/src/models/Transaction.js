export function mapTransaction(document) {
  if (!document) return null
  return {
    ...document,
    id: document.id ?? document._id,
    amount: Number(document.amount || 0),
    balanceAfter: Number(document.balanceAfter || 0),
  }
}

export function mapTransactions(documents = []) {
  return documents.map(mapTransaction).filter(Boolean)
}