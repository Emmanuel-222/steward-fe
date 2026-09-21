import { test, expect } from 'vitest';
import { createStewardSchema } from './schema';

const validSteward = {
  name: 'Ada Obi',
  email: 'ada@example.com',
  phone: '+2348012345678',
  password: 'Passw0rd!',
  department: 'protocol dept.',
  role: 'Steward' as const,
}

test('accepts a real birthday', () => {
  const result = createStewardSchema.safeParse({
    ...validSteward,
    birthday: '25/12/1995',
  })
  expect(result.success).toBe(true)
})

test('rejects an impossible date like 31/02/2000', () => {
  const result = createStewardSchema.safeParse({
    ...validSteward,
    birthday: '31/02/2000',
  })
  expect(result.success).toBe(false)
})
