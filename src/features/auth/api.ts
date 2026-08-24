import api from '../../services/axios'
import type {
  AuthResponse,
  AuthUser,
  CompleteOnboardingPayload,
  LoginPayload,
  SignupPayload,
  SignupResponse,
  VerifyEmailResponse,
} from './types'

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function refresh() {
  const { data } = await api.post<AuthResponse>('/auth/refresh')
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

// NOTE: the backend doesn't expose signup/verification routes yet — this is
// the contract the UI is built against. Update the URL/payload/response
// shape here once the API is ready; nothing else should need to change.
export async function signup(payload: SignupPayload) {
  const { data } = await api.post<SignupResponse>('/auth/signup', payload)
  return data
}

export async function verifyEmail(token: string) {
  const { data } = await api.post<VerifyEmailResponse>(`/auth/verify-email/${token}`)
  return data
}
