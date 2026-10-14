import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { sessionStatus } from './sessionStatus'

describe('sessionStatus', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  test('is Upcoming before the start', () => {
    vi.setSystemTime(new Date('2026-01-12T06:00:00'))
    expect(sessionStatus('2026-01-12T00:00:00.000Z', '7:10 AM', '8:10 AM')).toBe('Upcoming')
  })

  test('is Ongoing between start and end', () => {
    vi.setSystemTime(new Date('2026-01-12T07:30:00'))
    expect(sessionStatus('2026-01-12T00:00:00.000Z', '7:10 AM', '8:10 AM')).toBe('Ongoing')
  })

  test('is Completed after the end', () => {
    vi.setSystemTime(new Date('2026-01-12T09:00:00'))
    expect(sessionStatus('2026-01-12T00:00:00.000Z', '7:10 AM', '8:10 AM')).toBe('Completed')
  })

  test('defaults to a 60 minute window when endTime is missing', () => {
    vi.setSystemTime(new Date('2026-01-12T07:40:00'))
    expect(sessionStatus('2026-01-12T00:00:00.000Z', '7:10 AM', null)).toBe('Ongoing')
  })

  test('is Ongoing exactly at the start time', () => {
    vi.setSystemTime(new Date('2026-01-12T07:10:00'))
    expect(sessionStatus('2026-01-12T00:00:00.000Z', '7:10 AM', '8:10 AM')).toBe('Ongoing')
  })

  test('is Ongoing exactly at the end time', () => {
    vi.setSystemTime(new Date('2026-01-12T08:10:00'))
    expect(sessionStatus('2026-01-12T00:00:00.000Z', '7:10 AM', '8:10 AM')).toBe('Ongoing')
  })

  test('falls back to Upcoming for an out-of-range time', () => {
    vi.setSystemTime(new Date('2026-01-12T07:30:00'))
    expect(sessionStatus('2026-01-12T00:00:00.000Z', '25:00', '26:00')).toBe('Upcoming')
  })
})
