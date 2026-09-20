import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as api from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => api.getToken())

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    api.setToken(data.access_token)
    setTokenState(data.access_token)
    return data
  }, [])

  const signup = useCallback(async (email, password) => {
    const data = await api.signup(email, password)
    api.setToken(data.access_token)
    setTokenState(data.access_token)
    return data
  }, [])

  const logout = useCallback(() => {
    api.clearToken()
    setTokenState(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      signup,
      logout,
    }),
    [token, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
