import { useNavigate } from 'react-router-dom'
import { getAccessToken, setAccessToken } from '../services/tokenStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://steward-api-nlga.onrender.com'

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

function useAuth() {
  const rawToken = getAccessToken()
  const userJson = localStorage.getItem('user')

  let token = rawToken
  let user = userJson ? JSON.parse(userJson) : null
  let isAuthenticated = false

  if (token && !isTokenExpired(token)) {
    isAuthenticated = true
  } else if (token) {
    setAccessToken(null)
    token = null
    user = null
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
