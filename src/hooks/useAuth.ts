function useAuth() {
  const token = localStorage.getItem('token')
  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    logout,
  }
}

export default useAuth
