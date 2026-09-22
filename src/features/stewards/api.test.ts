import { describe, expect, test } from 'vitest'
import {
  createInitials,
  extractStewardArray,
  formatAttendanceTime,
  formatBirthday,
  formatDate,
  normalizeAttendanceRecord,
  normalizeAttendanceStatus,
  normalizeAttendanceSummary,
  normalizeSteward,
  toTitleCase,
} from './api'

describe('toTitleCase', () => {
  test('capitalises each word', () => {
    expect(toTitleCase('alpha team')).toBe('Alpha Team')
  })

  test('splits on underscores and hyphens', () => {
    expect(toTitleCase('pastor_care-team')).toBe('Pastor Care Team')
  })

  test('lowercases before capitalising', () => {
    expect(toTitleCase('TEAMONE')).toBe('Teamone')
  })

  test('returns an empty string for empty input', () => {
    expect(toTitleCase('')).toBe('')
  })
})

describe('createInitials', () => {
  test('uses the first letter of the first two words', () => {
    expect(createInitials('Ada Obi')).toBe('AO')
  })

  test('ignores words after the second', () => {
    expect(createInitials('Ada Ngozi Obi')).toBe('AN')
  })

  test('falls back to ST when there are no words', () => {
    expect(createInitials('')).toBe('ST')
  })
})

describe('formatBirthday', () => {
  test('formats a UTC timestamp as DD/MM/YYYY', () => {
    expect(formatBirthday('1995-12-25T00:00:00.000Z')).toBe('25/12/1995')
  })

  test('returns undefined for empty input', () => {
    expect(formatBirthday(null)).toBeUndefined()
  })

  test('returns the raw value when it cannot be parsed', () => {
    expect(formatBirthday('not-a-date')).toBe('not-a-date')
  })
})

describe('formatDate', () => {
  test('returns N/A for missing or non-string values', () => {
    expect(formatDate(undefined)).toBe('N/A')
    expect(formatDate(42)).toBe('N/A')
  })

  test('returns the raw value when it cannot be parsed', () => {
    expect(formatDate('nope')).toBe('nope')
  })

  test('formats a valid date in en-US', () => {
    expect(formatDate('1995-12-15T12:00:00.000Z')).toContain('Dec')
    expect(formatDate('1995-12-15T12:00:00.000Z')).toContain('1995')
  })
})

describe('normalizeSteward', () => {
  test('maps a full backend user into the display shape', () => {
    const steward = normalizeSteward({
      id: 7,
      fullName: 'Ada Obi',
      email: 'ada@example.com',
      department: 'alpha team',
      role: 'leader',
      phone: '+2348012345678',
      createdAt: '2026-01-15T12:00:00.000Z',
      birthday: '1995-12-25T00:00:00.000Z',
    })

    expect(steward).toMatchObject({
      id: '7',
      name: 'Ada Obi',
      email: 'ada@example.com',
      department: 'Alpha Team',
      role: 'Leader',
      roleTone: 'bg-blue-100 text-blue-700',
      phone: '+2348012345678',
      birthday: '25/12/1995',
    })
    expect(steward.initials).toBe('AO')
  })

  test('builds the name from first and last name', () => {
    const steward = normalizeSteward({ id: '1', firstName: 'Ada', lastName: 'Obi' })
    expect(steward.name).toBe('Ada Obi')
  })

  test('falls back to N/A for a missing phone and a neutral role tone', () => {
    const steward = normalizeSteward({ id: '1', name: 'Ada Obi', role: 'Steward' })
    expect(steward.phone).toBe('N/A')
    expect(steward.roleTone).toBe('bg-emerald-100 text-emerald-700')
  })
})

describe('extractStewardArray', () => {
  test('returns arrays unchanged', () => {
    expect(extractStewardArray([1, 2])).toEqual([1, 2])
  })

  test('reads the common wrapper keys', () => {
    expect(extractStewardArray({ items: ['a'] })).toEqual(['a'])
    expect(extractStewardArray({ users: ['b'] })).toEqual(['b'])
    expect(extractStewardArray({ data: ['c'] })).toEqual(['c'])
    expect(extractStewardArray({ results: ['d'] })).toEqual(['d'])
  })

  test('returns an empty array otherwise', () => {
    expect(extractStewardArray(null)).toEqual([])
    expect(extractStewardArray({ nope: true })).toEqual([])
  })
})

describe('normalizeAttendanceStatus', () => {
  test('title-cases known statuses', () => {
    expect(normalizeAttendanceStatus('present')).toBe('Present')
    expect(normalizeAttendanceStatus('late')).toBe('Late')
  })

  test('falls back to Unknown', () => {
    expect(normalizeAttendanceStatus(undefined)).toBe('Unknown')
  })
})

describe('normalizeAttendanceSummary', () => {
  test('defaults missing counts to zero', () => {
    expect(normalizeAttendanceSummary(undefined)).toEqual({ total: 0, present: 0, absent: 0 })
  })

  test('coerces numeric strings to numbers', () => {
    expect(normalizeAttendanceSummary({ total: '5', present: '3', absent: '2' })).toEqual({
      total: 5,
      present: 3,
      absent: 2,
    })
  })
})

describe('normalizeAttendanceRecord', () => {
  test('maps a record that nests meeting data', () => {
    const record = normalizeAttendanceRecord({
      id: 3,
      status: 'present',
      markedAt: '2026-09-20T09:05:00.000Z',
      meeting: { type: 'Sunday' },
    })

    expect(record.id).toBe('3')
    expect(record.status).toBe('Present')
    expect(record.meeting).toBe('Sunday')
  })

  test('defaults the meeting label', () => {
    expect(normalizeAttendanceRecord({ id: 1 }).meeting).toBe('Meeting')
  })
})

describe('formatAttendanceTime', () => {
  test('returns a dash for missing input', () => {
    expect(formatAttendanceTime('')).toBe('-')
  })

  test('returns the raw value when it cannot be parsed', () => {
    expect(formatAttendanceTime('nope')).toBe('nope')
  })

  test('formats a valid timestamp as a time', () => {
    expect(formatAttendanceTime('2026-09-20T09:05:00.000Z')).toMatch(/\d{2}:\d{2}/)
  })
})
