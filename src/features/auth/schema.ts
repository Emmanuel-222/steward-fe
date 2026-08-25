import { z } from 'zod'
import { DEPARTMENTS } from '../../constants/departments'
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
    department: z.string().refine(
      (val) => (DEPARTMENTS as readonly string[]).includes(val),
      'Select a valid department',
    ),
    password: z.string().regex(PASSWORD_POLICY_REGEX, PASSWORD_POLICY_ERROR),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
