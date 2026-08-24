import type { z } from 'zod'
import type { loginSchema, signupSchema } from './schema'

export type LoginPayload = z.infer<typeof loginSchema>

export type SignupFormValues = z.infer<typeof signupSchema>

export type SignupPayload = Omit<SignupFormValues, 'confirmPassword'>

export type SignupResponse = {
  message?: string
  email?: string
}

export type VerifyEmailResponse = {
  message?: string
}

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
  user?: AuthUser
  message?: string
}

export type CompleteOnboardingPayload = {
  code?: string
  newPassword: string
}
