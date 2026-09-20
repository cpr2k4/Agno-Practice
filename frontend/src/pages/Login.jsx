import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import PasswordField from '../components/PasswordField.jsx'

function Login() {
  const { isAuthenticated, login } = useAuth()
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

    setLoading(true)
    try {
      await login(trimmedEmail, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Cannot reach the backend. Make sure it is running on port 8000.'
          : err.message || 'Login failed.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="content">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2 className="auth-form__title">Log in</h2>

        <div className="field">
          <label htmlFor="login-email" className="field__label">
            Email
          </label>
          <input
            id="login-email"
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
          id="login-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          autoComplete="current-password"
        />

        {error ? (
          <p className="feedback feedback--error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="send auth-form__submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="auth-form__footer">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </main>
  )
}

export default Login
