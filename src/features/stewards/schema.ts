import { z } from 'zod'

export const stewardRoleOptions = ['Steward', 'Leader', 'Pastor', 'Admin'] as const

export const createStewardSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters long'),
  email: z.email('Enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  department: z.string().min(2, 'Department must be at least 2 characters long'),
  role: z.enum(stewardRoleOptions, {
    message: 'Select a system role',
  }),
})

export const updateStewardSchema = createStewardSchema.omit({
  password: true,
})
