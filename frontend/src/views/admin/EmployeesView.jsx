import { useState } from 'react'
import { ArrowRight, Briefcase, CheckCircle2, CircleAlert, Eye, EyeOff, Plus, ShieldCheck, User, Users } from 'lucide-react'

/* --------------------------------------------------------------------------
   ADMIN VIEW 5: EMPLOYEE MANAGEMENT
   Props:
     employees    – array of employee objects
     loading      – boolean
     onSubmit     – async (fields) => void   (handled by useEmployeesController)
   -------------------------------------------------------------------------- */
export function AdminEmployeesSection({ employees, loading, onSubmit }) {
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  async function handleCreateEmployee(e) {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      await onSubmit({ username: username.trim(), password, fullName: fullName.trim() })
      setShowForm(false)
      setUsername('')
      setPassword('')
      setFullName('')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {/* Header KPI Cards */}
      <div className="admin-stats-grid" style={{ marginBottom: '20px' }}>
        <div className="admin-metric-card card-vault">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Total Staff Members</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{employees.length}</div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-purple">EMPLOYEE Role</span>
            <span>Active Bank Staff</span>
          </div>
        </div>

        <div className="admin-metric-card card-deposits">
          <div className="admin-metric-top">
            <span className="admin-metric-label">Teller Desks Active</span>
            <div className="admin-metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <Briefcase size={20} />
            </div>
          </div>
          <div className="admin-metric-val">{employees.length}</div>
          <div className="admin-metric-sub">
            <span className="admin-metric-chip chip-blue">All Shifts</span>
            <span>Operational Counters</span>
          </div>
        </div>
      </div>

      {/* Employee List Table */}
      <div className="master-table-card">
        <div className="master-table-header">
          <div>
            <h3>Bank Staff & Teller Directory ({employees.length} Members)</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              All employees provisioned with teller counter access to customer accounts and transactions.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
            onClick={() => {
              setShowForm(!showForm)
              setFormError('')
            }}
          >
            <Plus size={15} />
            <span>{showForm ? 'Cancel' : 'Add Employee'}</span>
          </button>
        </div>

        {/* Create Employee Form */}
        {showForm && (
          <div
            style={{
              margin: '0 24px 24px',
              padding: '20px 24px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
            }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={14} />
              </div>
              Create New Employee Account
            </h4>

            {formError && (
              <div style={{ padding: '10px 14px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#e11d48', fontSize: '12px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CircleAlert size={15} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateEmployee} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter employee name"
                  required
                  maxLength={100}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  minLength={3}
                  maxLength={40}
                  pattern="[A-Za-z0-9._\-]+"
                  title="Only letters, numbers, dots, underscores, dashes"
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Temporary Password
                </label>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  maxLength={72}
                  style={{ width: '100%', padding: '9px 36px 9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '10px', top: '31px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px' }}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', flex: 1 }}
                >
                  {submitting ? 'Creating…' : 'Create Employee'}
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setShowForm(false); setFormError('') }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <div className="loader" style={{ margin: '0 auto 12px' }} />
              <p>Loading employee directory…</p>
            </div>
          ) : employees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Users size={24} />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>No Employees Yet</h4>
              <p style={{ fontSize: '13px' }}>Click "Add Employee" to provision a new teller or staff account.</p>
            </div>
          ) : (
            <table className="master-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Access Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          className="account-pill-avatar"
                          style={{ width: '34px', height: '34px', background: 'rgba(124,58,237,0.2)', color: '#a78bfa', borderColor: 'rgba(124,58,237,0.35)' }}
                        >
                          {emp.fullName ? emp.fullName.charAt(0).toUpperCase() : 'E'}
                        </div>
                        <div>
                          <strong style={{ fontSize: '13px', color: '#0f172a' }}>{emp.fullName}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Bank Staff</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-account-pill" style={{ fontFamily: 'var(--font-mono)' }}>@{emp.username}</span>
                    </td>
                    <td>
                      <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: '#f5f3ff', color: '#7c3aed' }}>
                        EMPLOYEE
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Customer Accounts View
                        </span>
                        <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> Teller Deposit & Withdrawal
                        </span>
                        <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={12} /> All Loans & Transactions View
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#059669', fontSize: '12px', fontWeight: '600' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Access Permissions Reference Card */}
      <div className="master-table-card" style={{ marginTop: '20px' }}>
        <div className="master-table-header">
          <div>
            <h3>Role Access Permissions Reference</h3>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Overview of what each role can access within the banking portal.
            </p>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            {
              role: 'CUSTOMER',
              color: '#2563eb',
              bg: '#eff6ff',
              border: '#bfdbfe',
              icon: User,
              permissions: [
                'View own accounts & balances',
                'Self-service deposit & withdraw',
                'Apply for loans & pay EMIs',
                'Download account statements',
                'Manage virtual debit card',
              ],
            },
            {
              role: 'EMPLOYEE',
              color: '#0284c7',
              bg: '#f0f9ff',
              border: '#bae6fd',
              icon: Briefcase,
              permissions: [
                'View all customer accounts',
                'Teller counter deposit & withdraw',
                'View all loans & transactions',
                'Teller audit log access',
                'No admin privileges',
              ],
            },
            {
              role: 'ADMIN',
              color: '#7c3aed',
              bg: '#f5f3ff',
              border: '#ddd6fe',
              icon: ShieldCheck,
              permissions: [
                'Full employee management',
                'Bank-wide treasury overview',
                'Global audit ledger access',
                'All staff permissions',
                'Full institutional visibility',
              ],
            },
          ].map(({ role, color, bg, border, icon: Icon, permissions }) => (
            <div key={role} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} />
                </div>
                <strong style={{ fontSize: '13px', color: '#0f172a' }}>{role}</strong>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {permissions.map((p, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#334155' }}>
                    <CheckCircle2 size={13} style={{ color, flexShrink: 0, marginTop: '1px' }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
