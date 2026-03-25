import type { z } from 'zod'
import type { loginSchema } from './schema'

export type LoginPayload = z.infer<typeof loginSchema>

export type AuthResponse = {
  token: string
  user?: {
    id: string
    email: string
    name?: string
  }
  message?: string
}
