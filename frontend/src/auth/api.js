const TOKEN_KEY = 'access_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

function formatDetail(detail) {
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(', ')
  }
  return 'Something went wrong.'
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(formatDetail(data.detail) || 'Request failed')
    error.status = response.status
    throw error
  }

  return data
}

export function signup(email, password) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: { email, password },
  })
}

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function sendEmail(topic, token) {
  return apiRequest('/send-email', {
    method: 'POST',
    body: { topic },
    token,
  })
}
