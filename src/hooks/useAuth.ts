function useAuth() {
  const token = localStorage.getItem('token')
  const logout = () => {
    localStorage.removeItem('token')
  }

  return {
    token,
    isAuthenticated: Boolean(token),
    logout,
  }
}

export default useAuth
