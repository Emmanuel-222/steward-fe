import { expect, test } from 'vitest'
import { isPasswordKey, trimStringsDeep } from './trimStrings'

test('trims leading and trailing spaces from a top-level string', () => {
  expect(trimStringsDeep('  2026 Intake  ')).toBe('2026 Intake')
})

test('keeps spaces inside a value', () => {
  expect(trimStringsDeep('  2026  Intake  ')).toBe('2026  Intake')
})

test('trims strings nested in objects', () => {
  expect(trimStringsDeep({ name: '  Cohort A ', startDate: '2026-01-01' })).toEqual({
    name: 'Cohort A',
    startDate: '2026-01-01',
  })
})

test('trims strings nested in arrays', () => {
  expect(trimStringsDeep([' a ', 'b '])).toEqual(['a', 'b'])
})

test('leaves non-string values untouched', () => {
  const when = new Date('2026-01-01T00:00:00.000Z')
  expect(trimStringsDeep({ count: 3, active: true, when, missing: null })).toEqual({
    count: 3,
    active: true,
    when,
    missing: null,
  })
})

test('leaves a FormData body untouched', () => {
  const form = new FormData()
  form.append('file', new Blob(['x']), 'x.txt')
  expect(trimStringsDeep(form)).toBe(form)
})

test('does not trim a value whose key is skipped', () => {
  expect(trimStringsDeep({ name: ' a ', password: ' hunter2 ' }, isPasswordKey)).toEqual({
    name: 'a',
    password: ' hunter2 ',
  })
})

test('skips password fields at any nesting depth', () => {
  expect(trimStringsDeep({ user: { newPassword: ' x ', name: ' y ' } }, isPasswordKey)).toEqual({
    user: { newPassword: ' x ', name: 'y' },
  })
})

test('recognises password keys, including camel and snake case', () => {
  expect(isPasswordKey('password')).toBe(true)
  expect(isPasswordKey('newPassword')).toBe(true)
  expect(isPasswordKey('confirm_password')).toBe(true)
  expect(isPasswordKey('name')).toBe(false)
})
