import { describe, expect, test } from 'vitest'
import { sessionDayLabel, weekdayFromDate } from './sessionCard'

describe('weekdayFromDate', () => {
  test('returns the weekday of the calendar date', () => {
    expect(weekdayFromDate('2026-10-21')).toBe('Wednesday')
    expect(weekdayFromDate('2026-10-25')).toBe('Sunday')
  })

  test('handles ISO timestamps by reading only the date part', () => {
    expect(weekdayFromDate('2026-10-21T00:00:00.000Z')).toBe('Wednesday')
  })

  test('returns null for missing or invalid input', () => {
    expect(weekdayFromDate(null)).toBeNull()
    expect(weekdayFromDate(undefined)).toBeNull()
    expect(weekdayFromDate('')).toBeNull()
  })
})

describe('sessionDayLabel', () => {
  test('prefers the real weekday when a date exists', () => {
    expect(sessionDayLabel('Sunday', '2026-10-21')).toBe('Wednesday')
  })

  test('falls back to the stored label when undated', () => {
    expect(sessionDayLabel('Sunday', null)).toBe('Sunday')
  })

  test('is empty when there is neither label nor date', () => {
    expect(sessionDayLabel(null, null)).toBe('')
  })
})
