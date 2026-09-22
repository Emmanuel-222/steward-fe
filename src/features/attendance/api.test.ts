import { afterEach, describe, expect, test, vi } from 'vitest'
import type { AxiosResponse } from 'axios'

vi.mock('../stewards/api', () => ({ getStewards: vi.fn() }))

import api from '../../services/axios'
import { getStewards } from '../stewards/api'
import {
  extractRecords,
  formatCheckinTime,
  getMeetingAttendance,
  getMeetingAttendanceWithStewards,
  normalizeRecord,
} from './api'
import type { Steward } from '../stewards/types'

function makeSteward(overrides: Partial<Steward>): Steward {
  return {
    id: '1',
    initials: 'S',
    name: 'Steward',
    email: 'steward@example.com',
    department: 'Alpha Team',
    role: 'Steward',
    roleTone: '',
    phone: '+2348012345678',
    dateAdded: 'N/A',
    ...overrides,
  }
}

function respondWith(data: unknown): AxiosResponse {
  return { data } as AxiosResponse
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('normalizeRecord', () => {
  test('maps fields and stringifies ids', () => {
    expect(normalizeRecord({ id: 5, status: 'present', userId: 2, meetingId: 9 })).toMatchObject({
      id: '5',
      status: 'present',
      userId: '2',
      meetingId: '9',
    })
  })

  test('defaults the status to present', () => {
    expect(normalizeRecord({ id: 1 }).status).toBe('present')
  })

  test('pulls the excuse reason out of a nested request', () => {
    expect(normalizeRecord({ id: 1, excuseRequest: { reason: 'Travel' } }).excuseReason).toBe(
      'Travel',
    )
  })
})

describe('formatCheckinTime', () => {
  test('returns null for empty or unparseable input', () => {
    expect(formatCheckinTime('')).toBeNull()
    expect(formatCheckinTime('nope')).toBeNull()
  })

  test('formats a valid timestamp as a time', () => {
    expect(formatCheckinTime('2026-09-20T09:05:00.000Z')).toMatch(/\d{2}:\d{2}/)
  })
})

describe('extractRecords', () => {
  test('reads arrays and wrapped payloads', () => {
    expect(extractRecords([1])).toEqual([1])
    expect(extractRecords({ records: [2] })).toEqual([2])
    expect(extractRecords({ data: [3] })).toEqual([3])
    expect(extractRecords({ attendance: [4] })).toEqual([4])
  })

  test('returns an empty array otherwise', () => {
    expect(extractRecords({ nope: true })).toEqual([])
    expect(extractRecords(null)).toEqual([])
  })
})

describe('getMeetingAttendance', () => {
  test('requests the meeting endpoint and normalizes the records', async () => {
    vi.spyOn(api, 'get').mockResolvedValue(
      respondWith({ records: [{ id: 1, status: 'present', userId: 2 }] }),
    )

    const records = await getMeetingAttendance('42')

    expect(api.get).toHaveBeenCalledWith('/attendance/meeting/42')
    expect(records).toHaveLength(1)
    expect(records[0].userId).toBe('2')
  })
})

describe('getMeetingAttendanceWithStewards', () => {
  test('merges stewards with records and computes stats', async () => {
    vi.mocked(getStewards).mockResolvedValue([
      makeSteward({ id: '1', role: 'Steward' }),
      makeSteward({ id: '2', role: 'Leader' }),
      makeSteward({ id: '3', role: 'Admin' }),
      makeSteward({ id: '4', role: 'Steward' }),
    ])
    vi.spyOn(api, 'get').mockResolvedValue(
      respondWith({
        records: [
          { id: 1, status: 'present', userId: 1, markedAt: '2026-09-20T09:00:00.000Z' },
          { id: 2, status: 'excused', userId: 2 },
          { id: 3, status: 'absent', userId: 4 },
        ],
      }),
    )

    const data = await getMeetingAttendanceWithStewards('42')

    expect(data.entries).toHaveLength(3)
    expect(data.stats).toMatchObject({ total: 3, present: 1, excused: 1, absent: 1, unmarked: 0 })
    expect(data.stats.rate).toBe('33%')
    expect(data.entries.map((entry) => entry.status)).toEqual(['Present', 'Excused', 'Absent'])
  })

  test('marks stewards with no record as Unmarked', async () => {
    vi.mocked(getStewards).mockResolvedValue([makeSteward({ id: '1' })])
    vi.spyOn(api, 'get').mockResolvedValue(respondWith({ records: [] }))

    const data = await getMeetingAttendanceWithStewards('42')

    expect(data.entries[0].status).toBe('Unmarked')
    expect(data.stats.rate).toBe('0%')
  })

  test('treats a late mark as Present', async () => {
    vi.mocked(getStewards).mockResolvedValue([makeSteward({ id: '1' })])
    vi.spyOn(api, 'get').mockResolvedValue(
      respondWith({ records: [{ id: 1, status: 'late', userId: 1 }] }),
    )

    const data = await getMeetingAttendanceWithStewards('42')

    expect(data.entries[0].status).toBe('Present')
  })
})
