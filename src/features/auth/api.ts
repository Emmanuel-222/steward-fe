import api from '../../services/axios'
import type {
  AuthResponse,
  AuthUser,
  CompleteOnboardingPayload,
  LoginPayload,
} from './types'

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function refresh(refreshToken: string) {
  const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken })
  return data
}

export async function sendVerificationCode() {
  const { data } = await api.post('/auth/onboarding/send-code')
  return data
}

export async function completeOnboarding(payload: CompleteOnboardingPayload) {
  const { data } = await api.patch<AuthUser>('/auth/onboarding', payload)
  return data
}
