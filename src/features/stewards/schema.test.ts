import { describe, expect, test } from 'vitest'
import { createStewardSchema, updateStewardSchema } from './schema'

const validSteward = {
  name: 'Ada Obi',
  email: 'ada@example.com',
  phone: '+2348012345678',
  password: 'Passw0rd!',
  department: 'protocol dept.',
  role: 'Steward' as const,
}

const validUpdate = {
  name: 'Ada Obi',
  email: 'ada@example.com',
  phone: '+2348012345678',
  department: 'protocol dept.',
  role: 'Steward' as const,
}

describe('createStewardSchema', () => {
  test('accepts a valid steward', () => {
    expect(createStewardSchema.safeParse(validSteward).success).toBe(true)
  })

  test('accepts an optional valid birthday', () => {
    expect(createStewardSchema.safeParse({ ...validSteward, birthday: '25/12/1995' }).success).toBe(
      true,
    )
  })

  test('rejects a malformed email', () => {
    expect(createStewardSchema.safeParse({ ...validSteward, email: 'nope' }).success).toBe(false)
  })

  test('rejects a phone that is not +234 followed by ten digits', () => {
    expect(createStewardSchema.safeParse({ ...validSteward, phone: '08012345678' }).success).toBe(
      false,
    )
  })

  test('rejects a weak password', () => {
    expect(createStewardSchema.safeParse({ ...validSteward, password: 'weakpass' }).success).toBe(
      false,
    )
  })

  test('rejects an unknown department', () => {
    expect(createStewardSchema.safeParse({ ...validSteward, department: 'nope' }).success).toBe(
      false,
    )
  })

  test('rejects an unknown role', () => {
    expect(createStewardSchema.safeParse({ ...validSteward, role: 'King' }).success).toBe(false)
  })

  test('rejects a birthday in the wrong format', () => {
    expect(
      createStewardSchema.safeParse({ ...validSteward, birthday: '1995-12-25' }).success,
    ).toBe(false)
  })

  test('rejects an impossible date like 31/02/2000', () => {
    expect(
      createStewardSchema.safeParse({ ...validSteward, birthday: '31/02/2000' }).success,
    ).toBe(false)
  })
})

describe('updateStewardSchema', () => {
  test('does not require a password', () => {
    expect(updateStewardSchema.safeParse(validUpdate).success).toBe(true)
  })
})
