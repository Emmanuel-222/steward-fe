import { z } from 'zod'
import { DEPARTMENTS } from '../../constants/departments'

export const stewardRoleOptions = ['Steward', 'Leader', 'Pastor', 'Admin'] as const

export const createStewardSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters long'),
  email: z.email('Enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  department: z.string().refine(
    (val) => (DEPARTMENTS as readonly string[]).includes(val),
    'Select a valid department',
  ),
  role: z.enum(stewardRoleOptions, {
    message: 'Select a system role',
  }),
  birthday: z
    .string()
    .refine(
      (value) => value === '' || /^\d{2}\/\d{2}\/\d{4}$/.test(value),
      'Use DD/MM/YYYY format',
    )
    .optional(),
})

export const updateStewardSchema = createStewardSchema.omit({
  password: true,
})
