import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import PasswordField from '../components/PasswordField.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Signup() {
  const { isAuthenticated, signup } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Email and password are required.')
      return
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await signup(trimmedEmail, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Cannot reach the backend. Make sure it is running on port 8000.'
          : err.message || 'Signup failed.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="content">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2 className="auth-form__title">Sign up</h2>

        <div className="field">
          <label htmlFor="signup-email" className="field__label">
            Email
          </label>
          <input
            id="signup-email"
            className="field__input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <PasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />

        {error ? (
          <p className="feedback feedback--error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="send auth-form__submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </button>

        <p className="auth-form__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  )
}

export default Signup
