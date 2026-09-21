import { z } from 'zod'
import { DEPARTMENTS } from '../../constants/departments'

export const stewardRoleOptions = ['Steward', 'Leader', 'Pastor', 'Admin'] as const

function isValidBirthday(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false
  const [day, month, year] = value.split('/').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export const createStewardSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters long'),
  email: z.email('Enter a valid email address'),
  phone: z.string().regex(
    /^\+234\d{10}$/,
    'Enter a valid Nigerian phone number (e.g. +234 801 234 5678)',
  ),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/,
      'Use a stronger password: at least 8 characters, with an uppercase letter, a number, and a symbol',
    ),
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
      (value) => value === '' || isValidBirthday(value),
      'Use DD/MM/YYYY format',
    )
    .optional(),
})

export const updateStewardSchema = createStewardSchema.omit({
  password: true,
})
