import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
  formatTime,
  getRawDate,
  getRawTime,
  normalizeExplicitStatus,
  normalizeMeeting,
  normalizeStatus,
  normalizeTimeValue,
  sortMeetings,
} from './api'
import type { Meeting } from './types'

function makeMeeting(overrides: Partial<Meeting>): Meeting {
  return {
    id: '1',
    status: 'Completed',
    statusTone: '',
    title: 'Meeting',
    type: 'Sunday',
    subtitle: '',
    date: '',
    time: '',
    location: '',
    present: null,
    absent: null,
    primaryAction: '',
    secondaryAction: '',
    rawDate: '2026-01-01',
    rawStartTime: '09:00',
    rawCutoffTime: '10:00',
    rawEndTime: '11:00',
    ...overrides,
  }
}

describe('normalizeTimeValue', () => {
  test('converts 12-hour times to 24-hour', () => {
    expect(normalizeTimeValue('7:00 AM')).toBe('07:00:00')
    expect(normalizeTimeValue('7:00 PM')).toBe('19:00:00')
  })

  test('handles midnight and noon', () => {
    expect(normalizeTimeValue('12:00 AM')).toBe('00:00:00')
    expect(normalizeTimeValue('12:30 PM')).toBe('12:30:00')
  })

  test('passes through 24-hour times', () => {
    expect(normalizeTimeValue('13:05')).toBe('13:05:00')
    expect(normalizeTimeValue('09:00:30')).toBe('09:00:30')
  })

  test('returns empty for unparseable input', () => {
    expect(normalizeTimeValue('sometime')).toBe('')
    expect(normalizeTimeValue('')).toBe('')
  })
})

describe('getRawDate', () => {
  test('keeps a plain date', () => {
    expect(getRawDate({ date: '2026-09-20' })).toBe('2026-09-20')
  })

  test('trims an ISO timestamp to its date part', () => {
    expect(getRawDate({ date: '2026-09-20T09:00:00.000Z' })).toBe('2026-09-20')
  })

  test('returns empty when no date is present', () => {
    expect(getRawDate({})).toBe('')
  })
})

describe('getRawTime', () => {
  test('returns the first usable value as HH:MM', () => {
    expect(getRawTime(undefined, '7:00 AM', '8:00 AM')).toBe('07:00')
  })

  test('returns empty when nothing is usable', () => {
    expect(getRawTime(undefined, '')).toBe('')
  })
})

describe('normalizeExplicitStatus', () => {
  test('maps backend spellings to canonical statuses', () => {
    expect(normalizeExplicitStatus('ungoing')).toBe('Ongoing')
    expect(normalizeExplicitStatus('finalized')).toBe('Completed')
    expect(normalizeExplicitStatus('ARCHIVED')).toBe('Archived')
  })

  test('title-cases unknown statuses', () => {
    expect(normalizeExplicitStatus('pending')).toBe('Pending')
  })

  test('returns empty for a missing status', () => {
    expect(normalizeExplicitStatus(undefined)).toBe('')
  })
})

describe('normalizeStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-20T10:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('is Upcoming before the start time', () => {
    expect(
      normalizeStatus({ date: '2026-09-20', startTime: '11:00', endTime: '12:00' }),
    ).toBe('Upcoming')
  })

  test('is Ongoing between start and end', () => {
    expect(
      normalizeStatus({ date: '2026-09-20', startTime: '09:00', endTime: '12:00' }),
    ).toBe('Ongoing')
  })

  test('is Completed after the end time', () => {
    expect(
      normalizeStatus({ date: '2026-09-20', startTime: '08:00', endTime: '09:00' }),
    ).toBe('Completed')
  })

  test('honours an explicit Ongoing even after the clock passes', () => {
    expect(
      normalizeStatus({
        status: 'Ongoing',
        date: '2026-09-20',
        startTime: '08:00',
        endTime: '09:00',
      }),
    ).toBe('Ongoing')
  })

  test('honours an explicit Completed regardless of the clock', () => {
    expect(
      normalizeStatus({
        status: 'Finalized',
        date: '2026-09-20',
        startTime: '11:00',
        endTime: '12:00',
      }),
    ).toBe('Completed')
  })

  test('is Archived when archived', () => {
    expect(normalizeStatus({ status: 'Archived' })).toBe('Archived')
  })
})

describe('normalizeMeeting', () => {
  test('builds a display meeting from backend fields', () => {
    const meeting = normalizeMeeting({
      id: 11,
      title: 'Sunday Service',
      type: 'Sunday',
      date: '2026-09-20',
      startTime: '9:00 AM',
      endTime: '11:00 AM',
      location: 'Main Hall',
      presentCount: 4,
      absentCount: 2,
    })

    expect(meeting.id).toBe('11')
    expect(meeting.title).toBe('Sunday Service')
    expect(meeting.date).toContain('Sep')
    expect(meeting.date).toContain('2026')
    expect(meeting.time).toBe('09:00 AM - 11:00 AM')
    expect(meeting.location).toBe('Main Hall')
    expect(meeting.present).toBe(4)
    expect(meeting.absent).toBe(2)
    expect(meeting.rawDate).toBe('2026-09-20')
    expect(meeting.rawStartTime).toBe('09:00')
  })

  test('keeps counts null when the backend omits them', () => {
    const meeting = normalizeMeeting({ id: 1, title: 'X', type: 'Sunday', date: '2026-09-20' })
    expect(meeting.present).toBeNull()
    expect(meeting.absent).toBeNull()
  })

  test('defaults missing text fields', () => {
    const meeting = normalizeMeeting({})
    expect(meeting.title).toBe('Untitled Meeting')
    expect(meeting.location).toBe('Location not set')
  })
})

describe('formatTime', () => {
  test('renders a 12-hour clock label', () => {
    expect(formatTime('09:00')).toBe('09:00 AM')
    expect(formatTime('13:30')).toBe('01:30 PM')
  })

  test('returns empty for missing input', () => {
    expect(formatTime('')).toBe('')
  })
})

describe('sortMeetings', () => {
  test('orders Ongoing, then Upcoming, then past meetings', () => {
    const ongoing = makeMeeting({ id: 'o', status: 'Ongoing', rawStartTime: '09:00' })
    const upcomingLate = makeMeeting({ id: 'u2', status: 'Upcoming', rawDate: '2026-12-01' })
    const upcomingSoon = makeMeeting({ id: 'u1', status: 'Upcoming', rawDate: '2026-10-01' })
    const pastOld = makeMeeting({ id: 'p1', status: 'Completed', rawDate: '2026-01-01' })
    const pastNew = makeMeeting({ id: 'p2', status: 'Completed', rawDate: '2026-06-01' })

    const sorted = sortMeetings([pastOld, upcomingLate, ongoing, pastNew, upcomingSoon])

    expect(sorted.map((meeting) => meeting.id)).toEqual(['o', 'u1', 'u2', 'p2', 'p1'])
  })

  test('orders multiple ongoing meetings by start time', () => {
    const late = makeMeeting({ id: 'late', status: 'Ongoing', rawStartTime: '11:00' })
    const early = makeMeeting({ id: 'early', status: 'Ongoing', rawStartTime: '08:00' })

    expect(sortMeetings([late, early]).map((meeting) => meeting.id)).toEqual(['early', 'late'])
  })

  test('does not mutate the input array', () => {
    const input = [makeMeeting({ id: 'x' })]
    const result = sortMeetings(input)

    expect(result).not.toBe(input)
    expect(input).toHaveLength(1)
  })
})
