import { useBankingDashboard } from '../../hooks/useBankingDashboard.js'
import { AdminEmployeesSection } from '../../views/admin/EmployeesView.jsx'

export default function AdminEmployeesPage() {
  const { employeesCtrl } = useBankingDashboard()

  return (
    <AdminEmployeesSection
      employees={employeesCtrl.employees}
      loading={employeesCtrl.loading}
      onSubmit={employeesCtrl.createEmployee}
    />
  )
}
