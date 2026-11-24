import { useBankingDashboard } from '../../hooks/useBankingDashboard.js'
import { LoansSection } from '../../views/customer/LoansView.jsx'

export default function LoansPage() {
  const { displayedLoans, formatMoney, setModal, loansCtrl } = useBankingDashboard()

  return (
    <LoansSection
      loans={displayedLoans}
      formatMoney={formatMoney}
      onApply={() => setModal('loan')}
      onPay={loansCtrl.payEmi}
      calcPrincipal={loansCtrl.calcPrincipal}
      setCalcPrincipal={loansCtrl.setCalcPrincipal}
      calcRate={loansCtrl.calcRate}
      setCalcRate={loansCtrl.setCalcRate}
      calcMonths={loansCtrl.calcMonths}
      setCalcMonths={loansCtrl.setCalcMonths}
    />
  )
}
