import axios from 'axios'
import {
  clearAccessToken,
  clearLoggedOut,
  getAccessToken,
  isLoggedOut,
  markLoggedOut,
  setAccessToken,
} from './tokenStore'
import { LOGIN_PATH } from '../app/router/paths'
import { isPasswordKey, trimStringsDeep } from '../utils/trimStrings'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ??
    'https://steward-api-nlga.onrender.com',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Never let stray leading/trailing whitespace reach the database. Passwords
  // are opaque and left exactly as typed.
  if (config.data !== undefined) {
    config.data = trimStringsDeep(config.data, isPasswordKey)
  }
  if (config.params !== undefined) {
    config.params = trimStringsDeep(config.params, isPasswordKey)
  }

  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  failedQueue = []
}

function endSession() {
  clearAccessToken()
  localStorage.clear()
  markLoggedOut()
  window.location.href = LOGIN_PATH
}

async function performRefresh(): Promise<string | null> {
  try {
    const { data } = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      {},
      { withCredentials: true },
    )
    const result = data.data ?? data
    setAccessToken(result.token)
    clearLoggedOut()
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user))
    }
    return result.token
  } catch (error) {
    // A response means the server rejected the session (401/403/…): it is over.
    if (axios.isAxiosError(error) && error.response) {
      return null
    }
    // No response (offline, timeout, DNS): transient — keep the session intact.
    throw error
  }
}

type LockManagerLike = {
  request?: <T>(name: string, callback: () => Promise<T>) => Promise<T>
}

let refreshPromise: Promise<string | null> | null = null

export function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      // Serialise refreshes across tabs so a token rotation is never raced.
      const locks = (navigator as unknown as { locks?: LockManagerLike }).locks
      if (locks?.request) {
        return await locks.request('steward-auth-refresh', () => performRefresh())
      }
      return await performRefresh()
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success === true && 'data' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/login') {
      return Promise.reject(error)
    }

    if (isLoggedOut()) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()
      if (newToken) {
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      }
      processQueue(new Error('Refresh failed'))
      endSession()
      return Promise.reject(error)
    } catch (refreshError) {
      // Transient failure — surface the error but keep the user signed in.
      processQueue(refreshError)
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)

export default api
