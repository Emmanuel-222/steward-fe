import { useNavigate } from 'react-router-dom'

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

function useAuth() {
  const rawToken = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')

  let token = rawToken
  let user = userJson ? JSON.parse(userJson) : null
  let isAuthenticated = false

  if (token && !isTokenExpired(token)) {
    isAuthenticated = true
  } else if (token) {
    localStorage.clear()
    token = null
    user = null
  }

  const navigate = useNavigate()
  const logout = () => {
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
