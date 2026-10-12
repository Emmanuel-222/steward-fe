import { z } from 'zod'
import { PASSWORD_POLICY_ERROR, PASSWORD_POLICY_REGEX } from '../../components/ui/PasswordRequirements'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
})

export const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    email: z.email('Enter a valid email address'),
    phone: z
      .string()
      .regex(/^\+234\d{10}$/, 'Enter a valid Nigerian phone number (e.g. +234 801 234 5678)'),
    password: z.string().regex(PASSWORD_POLICY_REGEX, PASSWORD_POLICY_ERROR),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
