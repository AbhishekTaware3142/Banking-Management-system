export function mapLoan(document) {
  if (!document) return null
  return {
    ...document,
    id: document.id ?? document._id,
    principal: Number(document.principal || 0),
    annualRatePercent: Number(document.annualRatePercent || 0),
    emi: Number(document.emi || 0),
    outstandingPrincipal: Number(document.outstandingPrincipal || 0),
  }
}

export function mapLoans(documents = []) {
  return documents.map(mapLoan).filter(Boolean)
}