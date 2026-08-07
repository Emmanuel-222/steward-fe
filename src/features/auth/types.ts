import type { z } from 'zod'
import type { loginSchema } from './schema'

export type LoginPayload = z.infer<typeof loginSchema>

export type OnboardingState = {
  required: boolean
  needsEmailVerify: boolean
  needsPasswordChange: boolean
}

export type AuthUser = {
  id: string
  email: string
  name?: string
  role?: string
  department?: string
  onboarding?: OnboardingState
}

export type AuthResponse = {
  token: string
  refreshToken: string
  user?: AuthUser
  message?: string
}

export type CompleteOnboardingPayload = {
  code?: string
  newPassword: string
}
