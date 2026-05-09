import { useNavigate } from 'react-router-dom'

function useAuth() {
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null

  const navigate = useNavigate()
  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    logout,
  }
}

export default useAuth
