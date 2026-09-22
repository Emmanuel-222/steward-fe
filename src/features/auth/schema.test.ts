import { describe, expect, test } from 'vitest'
import { loginSchema, signupSchema } from './schema'

describe('loginSchema', () => {
  test('accepts a valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'ada@example.com', password: 'secret1' }).success).toBe(
      true,
    )
  })

  test('rejects a malformed email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'secret1' }).success).toBe(false)
  })

  test('rejects a password under six characters', () => {
    expect(loginSchema.safeParse({ email: 'ada@example.com', password: '12345' }).success).toBe(
      false,
    )
  })
})

const validSignup = {
  firstName: 'Ada',
  lastName: 'Obi',
  email: 'ada@example.com',
  department: 'protocol dept.',
  password: 'Passw0rd!',
  confirmPassword: 'Passw0rd!',
}

describe('signupSchema', () => {
  test('accepts a valid signup', () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true)
  })

  test('rejects a password that fails the policy', () => {
    expect(
      signupSchema.safeParse({ ...validSignup, password: 'weakpass', confirmPassword: 'weakpass' })
        .success,
    ).toBe(false)
  })

  test('reports mismatched passwords against confirmPassword', () => {
    const result = signupSchema.safeParse({ ...validSignup, confirmPassword: 'Different1!' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword'])
    }
  })

  test('rejects an unknown department', () => {
    expect(signupSchema.safeParse({ ...validSignup, department: 'nope' }).success).toBe(false)
  })
})
