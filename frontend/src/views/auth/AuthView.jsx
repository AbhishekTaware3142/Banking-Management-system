import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Landmark,
  Lock,
  Percent,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react'
import '../../styles/auth.css'

export default function AuthView({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = mode === 'register' 
      ? { username, password, fullName } 
      : { username, password }

    try {
      if (mode === 'register') await onRegister(payload)
      else await onLogin(payload)
    } catch (exception) {
      const isConnectionIssue = exception.message.toLowerCase().includes('fetch') ||
        exception.message.toLowerCase().includes('network') ||
        exception.message.toLowerCase().includes('failed to fetch')
      
      if (isConnectionIssue) {
        setError('The banking API is currently unavailable. Please ensure the backend server is running.')
      } else {
        setError(exception.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isRegister = mode === 'register'

  return (
    <div className="auth-wrapper">
      {/* Left Brand Showcase Section */}
      <section className="auth-hero-pane">
        <div className="auth-hero-brand">
          <div className="auth-brand-logo">
            <Landmark size={24} />
          </div>
          <div className="auth-brand-text">
            <h2>Demo Bank</h2>
            <span>FIELDNOTE PRIVATE BANKING</span>
          </div>
        </div>

        <div className="auth-hero-body">
          <div className="auth-hero-badge">
            <i />
            <span>SPRING SECURITY + JWT AUTH</span>
          </div>
          <h1 className="auth-hero-title">
            Banking App Demo for <span>Modern Finance</span>.
          </h1>
          <p className="auth-hero-desc">
            A full-stack banking interface with secure user login, account management, transfers, loans, and API-driven data flows.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <ShieldCheck size={18} />
              </div>
              <div className="auth-feature-info">
                <h4>JWT Session Authentication</h4>
                <p>Protected routes use backend validation with an HTTP-only token cookie.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Zap size={18} />
              </div>
              <div className="auth-feature-info">
                <h4>REST API-Driven Banking Flow</h4>
                <p>Frontend actions connect to a Spring Boot backend for accounts, cards, and transfers.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <Percent size={18} />
              </div>
              <div className="auth-feature-info">
                <h4>Loan & Account Workflows</h4>
                <p>Includes EMIs, balances, activity tracking, and demo-ready financial operations.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          <span>
            <CheckCircle2 size={13} color="#10b981" /> JWT cookie auth
          </span>
          <span>Spring Boot API</span>
          <span>MongoDB backend</span>
        </div>
      </section>

      {/* Right Form Section */}
      <section className="auth-form-pane">
        <div className="auth-form-card">
          <div className="auth-card-header">
            <div className="auth-security-pill">
              <Lock size={12} />
              <span>BANKING APP PORTAL</span>
            </div>
            <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
            <p>
              {isRegister
                ? 'Register to access your accounts, cards, and loan information.'
                : 'Sign in to view your accounts, cards, and transaction activity.'}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="auth-tab-group" role="tablist" aria-label="Account access modes">
            <button
              type="button"
              className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
              onClick={() => {
                setMode('login')
                setError('')
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
              onClick={() => {
                setMode('register')
                setError('')
              }}
            >
              Open New Account
            </button>
          </div>

          {error && (
            <div className="auth-alert-box error" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={submit}>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="reg-fullname">Legal Full Name</label>
                <div className="auth-input-container">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your legal name"
                    required
                    maxLength={100}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-username">Account Username</label>
              <div className="auth-input-container">
                <User size={16} className="auth-input-icon" />
                <input
                  id="auth-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  minLength={3}
                  maxLength={40}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">Account Password</label>
              <div className="auth-input-container">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegister ? 'Minimum 8 characters' : 'Enter your password'}
                  required
                  minLength={isRegister ? 8 : undefined}
                  maxLength={72}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="auth-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? 'Authenticating…' : isRegister ? 'Create Account' : 'Sign In'}
              <ArrowRight size={16} />
            </button>

          </form>

          <div className="auth-card-footer">
            <ShieldCheck size={14} />
            <span>JWT session validation with backend auth checks</span>
          </div>
        </div>
      </section>
    </div>
  )
}
