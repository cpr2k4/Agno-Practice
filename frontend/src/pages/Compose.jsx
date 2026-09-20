import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { sendEmail } from '../auth/api.js'

function Compose() {
  const { token, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const topic = message.trim()
    if (!topic) {
      setStatus('error')
      setFeedback('Please enter what mail you want to send.')
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      const data = await sendEmail(topic, token)
      setStatus('success')
      setFeedback(data.response || 'Email sent.')
      setMessage('')
    } catch (error) {
      if (error.status === 401) {
        logout()
        navigate('/login', { replace: true })
        return
      }

      setStatus('error')
      const messageText =
        error instanceof TypeError
          ? 'Cannot reach the backend. Make sure it is running on port 8000.'
          : error.message || 'Something went wrong.'
      setFeedback(messageText)
    }
  }

  return (
    <main className="content">
      <form className="compose" onSubmit={handleSubmit}>
        <label htmlFor="mail-message" className="sr-only">
          What mail do you want to send?
        </label>
        <textarea
          id="mail-message"
          className="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="What mail do you want to send?"
          rows={6}
          disabled={status === 'loading'}
        />
        <button type="submit" className="send" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send'}
        </button>
        {feedback ? (
          <p
            className={`feedback feedback--${status === 'error' ? 'error' : 'success'}`}
            role="status"
          >
            {feedback}
          </p>
        ) : null}
      </form>
    </main>
  )
}

export default Compose
