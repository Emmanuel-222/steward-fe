import { expect, test } from 'vitest'
import { toE164Phone } from './phone'

test('normalises a local number with a leading zero', () => {
  expect(toE164Phone('08012345678')).toBe('+2348012345678')
})

test('keeps an already-international number', () => {
  expect(toE164Phone('+234 801 234 5678')).toBe('+2348012345678')
})

test('returns empty string for empty input', () => {
  expect(toE164Phone('')).toBe('')
})