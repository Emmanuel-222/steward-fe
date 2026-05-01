import api from '../../services/axios'
import type { AuthResponse, LoginPayload } from './types'

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}
