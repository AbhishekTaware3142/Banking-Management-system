import { useBankingDashboard } from '../../hooks/useBankingDashboard.js'
import { TellerLoansSection } from '../../views/teller/LoansView.jsx'

export default function TellerLoansPage() {
  const { allLoans, formatMoney } = useBankingDashboard()
  return <TellerLoansSection allLoans={allLoans} formatMoney={formatMoney} />
}
