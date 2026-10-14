import { useEffect, useState } from 'react'
import {
  ArrowLeftRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Landmark,
  LogOut,
  Plus,
  Send,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { OverviewSection, AccountsSection, TransfersSection, ActivitySection, LoansSection, ActionModal } from '../features/customer/index.js'
import { money } from '../utils/formatters.js'
import { accountService } from '../services/accountService.js'
import { adminService } from '../services/adminService.js'
import { transactionService } from '../services/transactionService.js'
import { loanService } from '../services/loanService.js'
import { AdminOverviewSection, AdminAccountsSection, AdminLoansSection, AdminAuditSection, AdminEmployeesSection } from '../features/admin/index.js'
import { TellerDeskSection, TellerAccountsSection, TellerHistorySection, TellerActionModal, TellerLoansSection } from '../features/teller/index.js'
import '../styles/banking.css'

// ── Controllers ──────────────────────────────────────────────────────────────
import { useOverviewController } from '../controllers/customer/useOverviewController.js'
import { useAccountsController } from '../controllers/customer/useAccountsController.js'
import { useActivityController } from '../controllers/customer/useActivityController.js'
import { useLoansController } from '../controllers/customer/useLoansController.js'
import { useAdminOverviewController } from '../controllers/admin/useAdminOverviewController.js'
import { useAuditController } from '../controllers/admin/useAuditController.js'
import { useEmployeesController } from '../controllers/admin/useEmployeesController.js'
import { useDeskController } from '../controllers/teller/useDeskController.js'
import { useHistoryController } from '../controllers/teller/useHistoryController.js'

// ── Constants ────────────────────────────────────────────────────────────────
const todayLabel = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

const CUSTOMER_NAV = [
  { id: 'overview',   label: 'Dashboard',       icon: WalletCards },
  { id: 'accounts',   label: 'Accounts & Cards', icon: CreditCard },
  { id: 'transfers',  label: 'Transfers & Pay',  icon: Send },
  { id: 'activity',   label: 'Statements',       icon: ArrowLeftRight },
  { id: 'loans',      label: 'Loans & EMI',      icon: Landmark },
]

const EMPLOYEE_NAV = [
  { id: 'teller-desk',     label: 'Counter Station & Chart',  icon: TrendingUp },
  { id: 'teller-accounts', label: 'All Customer Accounts',    icon: CreditCard },
  { id: 'teller-loans',    label: 'All Customer Loans',       icon: Landmark },
  { id: 'teller-history',  label: 'Teller Audit Logs',        icon: Clock3 },
]

const ADMIN_NAV = [
  { id: 'admin-overview',   label: 'Treasury & Reserves',    icon: Landmark },
  { id: 'admin-accounts',   label: 'All Bank Accounts',       icon: CreditCard },
  { id: 'admin-loans',      label: 'Credit & Loans Book',     icon: FileText },
  { id: 'admin-audit',      label: 'Global Audit Ledger',     icon: ArrowLeftRight },
  { id: 'admin-employees',  label: 'Employee Management',     icon: Users },
  { id: 'overview',         label: 'Customer View',           icon: WalletCards },
]

function errorMessage(error) {
  return error.message.toLowerCase().includes('fetch')
    ? 'Banking API is currently offline. Check the backend host and server status.'
    : error.message
}

// ── Component ────────────────────────────────────────────────────────────────
export default function BankingDashboard() {
  const { user: authUser, logout: logoutSession } = useAuth()

  // ── Shared state ────────────────────────────────────────────────────────
  const [accounts, setAccounts]         = useState([])
  const [accountId, setAccountId]       = useState('')
  const [transactions, setTransactions] = useState([])
  const [loans, setLoans]               = useState([])
  const [view, setView]                 = useState('overview')
  const [modal, setModal]               = useState(null)
  const [receiptTx, setReceiptTx]       = useState(null)
  const [loading, setLoading]           = useState(true)
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState('')
  const [toast, setToast]               = useState(null)
  const [privacyMode, setPrivacyMode]   = useState(false)
  const activeRole = authUser?.role?.toUpperCase() || 'CUSTOMER'

  // Staff-wide data
  const [allAccounts, setAllAccounts]         = useState([])
  const [bankStats, setBankStats]             = useState(null)
  const [allTransactions, setAllTransactions] = useState([])
  const [allLoans, setAllLoans]               = useState([])

  // ── Derived values ───────────────────────────────────────────────────────
  const isAdminCustomerView = activeRole === 'ADMIN' && view === 'overview'
  const visibleAccounts     = isAdminCustomerView ? allAccounts : accounts
  const account             = accounts.find((a) => a.id === accountId)
    || (isAdminCustomerView
      ? allAccounts.find((a) => a.id === accountId) || allAccounts[0]
      : undefined)

  const displayedTransactions = isAdminCustomerView
    ? allTransactions.filter((t) => t.accountId === account?.id)
    : transactions

  const displayedLoans = isAdminCustomerView
    ? allLoans.filter((l) => l.accountId === account?.id)
    : loans

  // ── Helpers ──────────────────────────────────────────────────────────────
  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  function formatMoney(amount) {
    if (privacyMode) return '₹••••••'
    return money.format(Number(amount || 0))
  }

  async function refreshAll() {
    try {
      const data = await accountService.list()
      setAccounts(data)
      const nextId = accountId || data[0]?.id
      if (nextId) {
        const [statement, accountLoans] = await Promise.all([
          transactionService.statement(nextId),
          loanService.forAccount(nextId),
        ])
        setTransactions(statement)
        setLoans(accountLoans)
      }
      setError('')
      showToast('Accounts and transactions updated.')
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function fetchStaffData() {
    try {
      const [stats, accs, txs, lns, graph] = await Promise.all([
        adminService.overview(),
        adminService.accounts(),
        adminService.transactions(),
        adminService.loans(),
        adminService.graph(),
      ])
      setBankStats(stats)
      setAllAccounts(accs || [])
      setAllTransactions(txs || [])
      setAllLoans(lns || [])
      deskCtrl.setTellerGraphData(graph || [])
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  // ── Controller hooks ─────────────────────────────────────────────────────

  // Customer
  const overviewCtrl = useOverviewController({
    transactions: displayedTransactions,
    loans: displayedLoans,
  })

  const accountsCtrl = useAccountsController({
    setAccountId,
    showToast, setModal, setSubmitting, setError, refreshAll,
  })

  const activityCtrl = useActivityController({
    transactions: displayedTransactions,
    account,
    showToast,
  })

  const loansCtrl = useLoansController({
    accountId,
    showToast, setModal, setSubmitting, setError, refreshAll,
  })

  // Admin
  const adminOverviewCtrl = useAdminOverviewController({ setView })
  const auditCtrl         = useAuditController({ setReceiptTx, setModal })
  const employeesCtrl     = useEmployeesController({ showToast })

  // Teller
  const deskCtrl = useDeskController({
    allTransactions,
    showToast,
    fetchStaffData,
    refreshAll, setSubmitting, setError,
  })

  const historyCtrl = useHistoryController({ setReceiptTx, setModal })

  // ── Modal dispatcher (account / deposit / withdraw / loan) ─────────────
  async function submitForm(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const fields = Object.fromEntries(new FormData(event.currentTarget))
    try {
      if (modal === 'account') {
        await accountsCtrl.createAccount(fields)
      } else if (modal === 'deposit' || modal === 'withdraw') {
        const amt = Number(fields.amount)
        if (modal === 'deposit') await accountService.deposit(accountId, amt)
        else await accountService.withdraw(accountId, amt)
        await refreshAll()
        showToast(modal === 'deposit'
          ? `₹${amt.toLocaleString('en-IN')} deposit recorded!`
          : `₹${amt.toLocaleString('en-IN')} withdrawal completed!`)
        setModal(null)
      } else if (modal === 'loan') {
        await loansCtrl.applyLoan(fields)
      }
    } catch (exception) {
      setError(errorMessage(exception))
      showToast(exception.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Logout ───────────────────────────────────────────────────────────────
  async function handleLogout() {
    await logoutSession()
    setAccounts([])
    setAccountId('')
    setTransactions([])
    setLoans([])
    setError('')
    showToast('You have securely signed out.')
  }

  function openAdminCustomerView(selectedAccountId) {
    const selectedAccount =
      allAccounts.find((a) => a.id === selectedAccountId) || allAccounts[0]
    if (!selectedAccount) {
      showToast('No customer accounts are available to preview.', 'error')
      return
    }
    setAccountId(selectedAccount.id)
    setView('overview')
  }

  // ── Effects ──────────────────────────────────────────────────────────────

  // Sync role when authUser changes
  useEffect(() => {
    if (authUser?.role) {
      const role = authUser.role.toUpperCase()
      if (role === 'ADMIN')          setView('admin-overview')
      else if (role === 'EMPLOYEE')  setView('teller-desk')
      else                           setView('overview')
    }
  }, [authUser])

  // Fetch staff-wide data for ADMIN / EMPLOYEE
  useEffect(() => {
    if (authUser && (activeRole === 'ADMIN' || activeRole === 'EMPLOYEE')) {
      fetchStaffData()
    }
  }, [authUser, activeRole]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load customer accounts
  useEffect(() => {
    let active = true
    if (!authUser) return () => { active = false }
    accountService.list()
      .then((data) => {
        if (!active) return
        setAccounts(data)
        setAccountId((cur) => (data.some((a) => a.id === cur) ? cur : data[0]?.id || ''))
        setError('')
      })
      .catch((ex) => { if (active) setError(errorMessage(ex)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [authUser])

  // Load statement + loans when accountId changes
  useEffect(() => {
    let active = true
    if (!authUser || !accountId) return () => { active = false }

    if (isAdminCustomerView) {
      setTransactions(allTransactions.filter((t) => t.accountId === accountId))
      setLoans(allLoans.filter((l) => l.accountId === accountId))
      setError('')
      return () => { active = false }
    }

    Promise.all([
      transactionService.statement(accountId),
      loanService.forAccount(accountId),
    ])
      .then(([statement, accountLoans]) => {
        if (!active) return
        setTransactions(statement)
        setLoans(accountLoans)
        setError('')
      })
      .catch((ex) => { if (active) setError(errorMessage(ex)) })

    return () => { active = false }
  }, [accountId, authUser, isAdminCustomerView, allTransactions, allLoans])

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="app-shell">
      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="brand-wrapper">
          <div
            className="brand-icon-box"
            style={{
              background:
                activeRole === 'ADMIN'
                  ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                  : activeRole === 'EMPLOYEE'
                    ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            <Landmark size={22} />
          </div>
          <div className="brand-title">
            <strong>Demo Bank</strong>
            <small
              style={{
                color:
                  activeRole === 'ADMIN'
                    ? '#c4b5fd'
                    : activeRole === 'EMPLOYEE'
                      ? '#7dd3fc'
                      : '#60a5fa',
              }}
            >
              {activeRole === 'ADMIN'
                ? 'EXECUTIVE HQ'
                : activeRole === 'EMPLOYEE'
                  ? 'TELLER COUNTER'
                  : 'FIELDNOTE PRIVATE'}
            </small>
          </div>
        </div>

        <div className="sidebar-account-section">
          <div className="sidebar-label">
            <span>
              {activeRole === 'ADMIN'
                ? 'Treasury Vault'
                : activeRole === 'EMPLOYEE'
                  ? 'Teller Drawer'
                  : 'Active Account'}
            </span>
            <span style={{ color: '#38bdf8' }}>
              {activeRole === 'ADMIN'
                ? `${allAccounts.length} Total`
                : activeRole === 'EMPLOYEE'
                  ? 'Shift Active'
                  : `${accounts.length} Total`}
            </span>
          </div>

          {activeRole === 'ADMIN' ? (
            <div className="account-selector-card" style={{ cursor: 'default' }}>
              <div className="account-pill-avatar" style={{ background: 'rgba(124,58,237,0.25)', color: '#c4b5fd', borderColor: 'rgba(124,58,237,0.4)' }}>
                <Building2 size={16} />
              </div>
              <div className="account-selector-meta">
                <strong>Vault Liquid Reserve</strong>
                <small>{bankStats ? formatMoney(bankStats.totalVaultBalance) : 'Unavailable'}</small>
              </div>
            </div>
          ) : activeRole === 'EMPLOYEE' ? (
            <div className="account-selector-card" style={{ cursor: 'default' }}>
              <div className="account-pill-avatar" style={{ background: 'rgba(2,132,199,0.25)', color: '#7dd3fc', borderColor: 'rgba(2,132,199,0.4)' }}>
                <Briefcase size={16} />
              </div>
              <div className="account-selector-meta">
                <strong>Counter Net Drawer</strong>
                <small>{formatMoney(deskCtrl.tellerShiftStats.netDrawer)}</small>
              </div>
            </div>
          ) : account ? (
            <button
              type="button"
              className="account-selector-card"
              onClick={() => setView('accounts')}
              title="Click to view accounts & cards"
            >
              <div className="account-pill-avatar">
                {account.holderName ? account.holderName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="account-selector-meta">
                <strong>{account.holderName}</strong>
                <small>{account.accountNumber} · {account.accountType}</small>
              </div>
              <ChevronDown size={14} color="#94a3b8" />
            </button>
          ) : (
            <p style={{ fontSize: '11px', color: '#94a3b8', padding: '0 10px' }}>
              No active accounts found.
            </p>
          )}
        </div>

        {/* Main Nav */}
        <nav className="sidebar-nav" aria-label="Main Navigation">
          {(activeRole === 'ADMIN'
            ? ADMIN_NAV
            : activeRole === 'EMPLOYEE'
              ? EMPLOYEE_NAV
              : CUSTOMER_NAV
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`sidebar-nav-item ${view === id ? 'active' : ''}`}
              onClick={() =>
                id === 'overview' && activeRole === 'ADMIN'
                  ? openAdminCustomerView()
                  : setView(id)
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {id === 'activity' && transactions.length > 0 && (
                <span className="sidebar-nav-badge">{transactions.length}</span>
              )}
              {id === 'teller-accounts' && allAccounts.length > 0 && (
                <span className="sidebar-nav-badge" style={{ background: 'rgba(2,132,199,0.3)', color: '#7dd3fc' }}>
                  {allAccounts.length}
                </span>
              )}
              {id === 'teller-loans' && allLoans.length > 0 && (
                <span className="sidebar-nav-badge" style={{ background: 'rgba(2,132,199,0.3)', color: '#7dd3fc' }}>
                  {allLoans.length}
                </span>
              )}
              {id === 'admin-accounts' && allAccounts.length > 0 && (
                <span className="sidebar-nav-badge" style={{ background: 'rgba(124,58,237,0.3)', color: '#c4b5fd' }}>
                  {allAccounts.length}
                </span>
              )}
              {id === 'admin-employees' && employeesCtrl.employees.length > 0 && (
                <span className="sidebar-nav-badge" style={{ background: 'rgba(124,58,237,0.3)', color: '#c4b5fd' }}>
                  {employeesCtrl.employees.length}
                </span>
              )}
              {id === 'loans' && overviewCtrl.activeLoans.length > 0 && (
                <span className="sidebar-nav-badge" style={{ background: 'rgba(59,130,246,0.3)', color: '#93c5fd' }}>
                  {overviewCtrl.activeLoans.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div className="sidebar-user">
          <div
            className="user-avatar"
            style={{
              background:
                activeRole === 'ADMIN'
                  ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                  : activeRole === 'EMPLOYEE'
                    ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                    : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            {authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-meta">
            <strong>{authUser?.fullName || authUser?.username}</strong>
            <small>
              {activeRole === 'ADMIN'
                ? 'Bank Administrator'
                : activeRole === 'EMPLOYEE'
                  ? 'Operations Teller'
                  : 'Private Client'}
            </small>
          </div>
          <button
            type="button"
            className="user-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ───────────────────────────────────────────────────── */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar-header">
          <div className="topbar-left">
            <div className="topbar-breadcrumb">
              <span>Demo Bank</span>
              <span>/</span>
              <span style={{ color: activeRole === 'ADMIN' ? '#8b5cf6' : activeRole === 'EMPLOYEE' ? '#0284c7' : '#2563eb', fontWeight: '700' }}>
                {activeRole === 'ADMIN' ? 'Executive HQ' : activeRole === 'EMPLOYEE' ? 'Teller Desk' : 'Customer'}
              </span>
              <span>/</span>
              <span className="active">
                {[...ADMIN_NAV, ...EMPLOYEE_NAV, ...CUSTOMER_NAV].find((n) => n.id === view)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-controls-group">
              <button
                type="button"
                className={`topbar-action-pill ${privacyMode ? 'active' : ''}`}
                onClick={() => {
                  setPrivacyMode(!privacyMode)
                  showToast(
                    privacyMode
                      ? 'Sensitive balances are now visible.'
                      : 'Privacy Mode enabled: balances masked.'
                  )
                }}
                title={privacyMode ? 'Reveal sensitive balances' : 'Hide sensitive balances (Privacy Mode)'}
              >
                {privacyMode ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{privacyMode ? 'Masked' : 'Privacy'}</span>
              </button>

              <div className="topbar-badge-secure">
                <span className="pulse-dot-green" />
                <span>HMAC-SHA256 · JAVA 17 LTS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content-container">
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: '10px',
                color: '#e11d48',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CircleAlert size={18} />
                <span>{error}</span>
              </div>
              <span
                style={{
                  padding: '4px 12px',
                  background: '#f8fafc',
                  color: '#0f172a',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid #e2e8f0',
                }}
              >
                Check Connection
              </span>
            </div>
          )}

          {/* Page Header Row */}
          <div className="page-header-row">
            <div className="page-header-titles">
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {todayLabel}
              </span>
              <h1>
                {view === 'overview'
                  ? `Welcome back, ${account?.holderName?.split(' ')[0] || authUser?.fullName?.split(' ')[0] || 'Member'}`
                  : view === 'admin-overview'    ? 'Bank Executive & Treasury Dashboard'
                  : view === 'admin-accounts'    ? 'Master Bank Accounts Directory'
                  : view === 'admin-loans'       ? 'Institutional Credit & Loan Portfolio'
                  : view === 'admin-audit'       ? 'Global Bank Audit Ledger'
                  : view === 'admin-employees'   ? 'Employee & Teller Management'
                  : view === 'teller-desk'       ? 'Operations Counter & Transaction Flow'
                  : view === 'teller-accounts'   ? 'Customer Account Services & Counter Actions'
                  : view === 'teller-loans'      ? 'All Customer Loans & Credit Facilities'
                  : view === 'teller-history'    ? 'Teller Counter Audit History'
                  : ([...ADMIN_NAV, ...EMPLOYEE_NAV, ...CUSTOMER_NAV].find((n) => n.id === view)?.label || 'Dashboard')}
              </h1>
              <p>
                {view === 'overview'         && 'Your account summary and recent activity.'}
                {view === 'accounts'         && 'Manage your linked accounts and cards.'}
                {view === 'transfers'        && 'Send transfers and manage payments.'}
                {view === 'activity'         && 'Review account statements and transactions.'}
                {view === 'loans'            && 'Track loans and repayments.'}
                {view === 'admin-overview'   && 'Real-time vault liquidity, customer deposit reserves, and aggregate loan risk.'}
                {view === 'admin-accounts'   && 'Multi-customer master directory with live balances and verification status.'}
                {view === 'admin-loans'      && 'Portfolio yield analysis, outstanding principals, and repayment rates.'}
                {view === 'admin-audit'      && 'Comprehensive immutable transaction stream across all branches.'}
                {view === 'admin-employees'  && 'Manage bank employee and teller accounts — create, view, and monitor staff.'}
                {view === 'teller-desk'      && 'Daily counter transaction activity graph and customer service counter.'}
                {view === 'teller-accounts'  && 'Direct counter cash deposit and withdrawal operations for any customer.'}
                {view === 'teller-loans'     && 'View all active and settled loan facilities across all customer accounts.'}
                {view === 'teller-history'   && 'Audit record of all counter cash operations performed by staff.'}
              </p>
            </div>

            <div className="page-header-actions">
              {(activeRole === 'CUSTOMER' || isAdminCustomerView) && visibleAccounts.length > 0 && (
                <select
                  aria-label="Select Account"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  style={{
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#0f172a',
                    cursor: 'pointer',
                  }}
                >
                  {visibleAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNumber} · {acc.accountType} ({money.format(acc.balance)})
                    </option>
                  ))}
                </select>
              )}

              {isAdminCustomerView ? null : activeRole === 'ADMIN' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setView('admin-employees')}>
                    <Users size={16} />
                    <span>Manage Staff</span>
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
                    onClick={() => setView('admin-audit')}
                  >
                    <ArrowLeftRight size={16} />
                    <span>Inspect Audit Ledger</span>
                  </button>
                </div>
              ) : activeRole === 'EMPLOYEE' ? (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
                  onClick={() => setView('teller-accounts')}
                >
                  <Users size={16} />
                  <span>Customer Accounts</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setModal(account ? 'deposit' : 'account')}
                >
                  <Plus size={16} />
                  <span>{account ? 'New Transaction' : 'Open Account'}</span>
                </button>
              )}
            </div>
          </div>

          {/* ── View Routing ─────────────────────────────────────────────── */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <div className="loader" style={{ margin: '0 auto 14px' }} />
              <p>Synchronizing real-time banking ledger…</p>
            </div>

          ) : view === 'admin-overview' ? (
            <AdminOverviewSection
              bankStats={bankStats}
              allAccounts={allAccounts}
              allTransactions={allTransactions}
              formatMoney={formatMoney}
              onNavigate={adminOverviewCtrl.navigateTo}
            />

          ) : view === 'admin-accounts' ? (
            <AdminAccountsSection
              allAccounts={allAccounts}
              formatMoney={formatMoney}
              onSelectAccount={(acc) => {
                openAdminCustomerView(acc.id)
                showToast(`Viewing account ${acc.accountNumber} in Customer view.`)
              }}
            />

          ) : view === 'admin-loans' ? (
            <AdminLoansSection allLoans={allLoans} formatMoney={formatMoney} />

          ) : view === 'admin-audit' ? (
            <AdminAuditSection
              allTransactions={allTransactions}
              formatMoney={formatMoney}
              onViewReceipt={auditCtrl.viewReceipt}
            />

          ) : view === 'admin-employees' ? (
            <AdminEmployeesSection
              employees={employeesCtrl.employees}
              loading={employeesCtrl.loading}
              onSubmit={employeesCtrl.createEmployee}
            />

          ) : view === 'teller-desk' ? (
            <TellerDeskSection
              allAccounts={allAccounts}
              allTransactions={allTransactions}
              tellerGraphData={deskCtrl.tellerGraphData}
              shiftStats={deskCtrl.tellerShiftStats}
              formatMoney={formatMoney}
              onTellerAction={deskCtrl.openTellerModal}
              onViewReceipt={historyCtrl.viewReceipt}
              onNavigate={setView}
            />

          ) : view === 'teller-accounts' ? (
            <TellerAccountsSection
              allAccounts={allAccounts}
              formatMoney={formatMoney}
              onTellerAction={deskCtrl.openTellerModal}
            />

          ) : view === 'teller-loans' ? (
            <TellerLoansSection allLoans={allLoans} formatMoney={formatMoney} />

          ) : view === 'teller-history' ? (
            <TellerHistorySection
              allTransactions={allTransactions}
              formatMoney={formatMoney}
              onViewReceipt={historyCtrl.viewReceipt}
            />

          ) : !account && activeRole === 'CUSTOMER' ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                maxWidth: '480px',
                margin: '40px auto',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Landmark size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                Open Your First Banking Account
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                Start managing balances, making instant wire transfers, and tracking credit facilities.
              </p>
              <button type="button" className="btn-primary" onClick={() => setModal('account')}>
                <Plus size={16} />
                <span>Open Savings / Current Account</span>
              </button>
            </div>

          ) : view === 'overview' ? (
            <OverviewSection
              account={account}
              transactions={displayedTransactions}
              activeLoans={overviewCtrl.activeLoans}
              formatMoney={formatMoney}
              totalInflows={overviewCtrl.totalInflows}
              totalOutflows={overviewCtrl.totalOutflows}
              onAction={setModal}
              onNavigate={setView}
              onViewReceipt={(tx) => { setReceiptTx(tx); setModal('receipt') }}
              readOnly={isAdminCustomerView}
            />

          ) : view === 'accounts' ? (
            <AccountsSection
              accounts={accounts}
              activeId={accountId}
              onSelect={setAccountId}
              onCreate={() => setModal('account')}
              formatMoney={formatMoney}
            />

          ) : view === 'transfers' ? (
            <TransfersSection
              account={account}
              formatMoney={formatMoney}
            />

          ) : view === 'activity' ? (
            <ActivitySection
              transactions={activityCtrl.filteredTransactions}
              allTransactionsCount={displayedTransactions.length}
              activityFilter={activityCtrl.activityFilter}
              setActivityFilter={activityCtrl.setActivityFilter}
              searchQuery={activityCtrl.searchQuery}
              setSearchQuery={activityCtrl.setSearchQuery}
              onExport={activityCtrl.exportStatement}
              formatMoney={formatMoney}
              onViewReceipt={(tx) => { setReceiptTx(tx); setModal('receipt') }}
            />

          ) : view === 'loans' ? (
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

          ) : null}
        </main>
      </div>

      {/* ── ACTION MODAL ─────────────────────────────────────────────────── */}
      {modal && (
        <ActionModal
          type={modal}
          account={account}
          receiptTx={receiptTx}
          calcPrincipal={loansCtrl.calcPrincipal}
          calcRate={loansCtrl.calcRate}
          calcMonths={loansCtrl.calcMonths}
          onClose={() => { setModal(null); setReceiptTx(null) }}
          onSubmit={submitForm}
          submitting={submitting}
        />
      )}

      {/* ── TELLER COUNTER MODAL ─────────────────────────────────────────── */}
      {deskCtrl.tellerModal && (
        <TellerActionModal
          modal={deskCtrl.tellerModal}
          onClose={deskCtrl.closeTellerModal}
          onSubmit={deskCtrl.handleTellerSubmit}
          submitting={submitting}
          error={error}
          formatMoney={formatMoney}
        />
      )}

      {/* ── TOAST ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className="toast-floating-container">
          <div className={`toast-pill ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <CircleAlert size={18} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
