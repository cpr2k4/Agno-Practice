import { useState } from 'react'
import './App.css'

const API_URL = '/send-email'

function App() {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const detail = data.detail
        const errorMessage =
          typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
              ? detail.map((item) => item.msg || JSON.stringify(item)).join(', ')
              : 'Failed to send email.'
        throw new Error(errorMessage)
      }

      setStatus('success')
      setFeedback(data.response || 'Email sent.')
      setMessage('')
    } catch (error) {
      setStatus('error')
      const messageText =
        error instanceof TypeError
          ? 'Cannot reach the backend. Make sure it is running on port 8000.'
          : error.message || 'Something went wrong.'
      setFeedback(messageText)
    }
  }

  return (
    <div className="app">
      <nav className="navbar" aria-label="Main">
        <h1 className="navbar__title">Email agent</h1>
      </nav>
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
    </div>
  )
}

export default App
