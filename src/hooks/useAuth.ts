import { useNavigate } from 'react-router-dom'
import { getAccessToken, setAccessToken } from '../services/tokenStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://steward-api-nlga.onrender.com'

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const part = token.split('.')[1] ?? ''
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') {
    return true
  }
  return payload.exp * 1000 < Date.now()
}

function readUser() {
  try {
    const userJson = localStorage.getItem('user')
    return userJson ? JSON.parse(userJson) : null
  } catch {
    return null
  }
}

function useAuth() {
  const rawToken = getAccessToken()
  const user = readUser()

  let token = rawToken
  let isAuthenticated = false

  if (token && !isTokenExpired(token)) {
    isAuthenticated = true
  } else if (token) {
    setAccessToken(null)
    token = null
  }

  const navigate = useNavigate()
  const logout = () => {
    void fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {})
    setAccessToken(null)
    localStorage.clear()
    navigate('/')
  }

  return {
    token,
    user,
    isAuthenticated,
    logout,
  }
}

export default useAuth
