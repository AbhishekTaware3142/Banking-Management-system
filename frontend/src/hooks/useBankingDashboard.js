import { useOutletContext } from 'react-router-dom'

export function useBankingDashboard() {
  const dashboard = useOutletContext()
  if (!dashboard) {
    throw new Error('useBankingDashboard must be used inside the banking dashboard route')
  }
  return dashboard
}
