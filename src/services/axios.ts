import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    'https://steward-api-nlga.onrender.com',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success === true && 'data' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    const isLoginRequest = error.config?.url === '/auth/login'

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }

    return Promise.reject(error)
  },
)

export default api
