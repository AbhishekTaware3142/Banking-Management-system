/**
 * useEmployeesController
 * Controller for the Admin Employee Management section.
 * Fetches the employee list and handles new employee creation,
 * removing that business logic from EmployeesView.
 */
import { useCallback, useEffect, useState } from 'react'
import { adminService } from '../../services/adminService.js'

/**
 * @param {object} params
 * @param {Function} params.showToast
 */
export function useEmployeesController({ showToast }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminService.employees()
      setEmployees(data || [])
    } catch {
      // fall through — remain on empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  async function createEmployee(fields) {
    const emp = await adminService.createEmployee(fields)
    setEmployees((prev) => [emp, ...prev])
    showToast(`Employee account created for ${emp.fullName}.`)
    return emp
  }

  return {
    employees,
    loading,
    createEmployee,
    refreshEmployees: fetchEmployees,
  }
}
