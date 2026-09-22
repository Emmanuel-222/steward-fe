import { describe, expect, test } from 'vitest'
import { meetingSchema, updateMeetingSchema } from './schema'

const validMeeting = {
  title: 'Sunday Service',
  type: 'Sunday',
  date: '2026-09-20',
  startTime: '09:00',
  cutoffTime: '09:30',
  endTime: '11:00',
  location: 'Main Hall',
}

describe('meetingSchema', () => {
  test('accepts a valid meeting', () => {
    expect(meetingSchema.safeParse(validMeeting).success).toBe(true)
  })

  test('rejects a cutoff at or before the start time', () => {
    expect(meetingSchema.safeParse({ ...validMeeting, cutoffTime: '08:00' }).success).toBe(false)
  })

  test('rejects an unknown meeting type', () => {
    expect(meetingSchema.safeParse({ ...validMeeting, type: 'Party' }).success).toBe(false)
  })

  test('requires a location', () => {
    expect(meetingSchema.safeParse({ ...validMeeting, location: '' }).success).toBe(false)
  })

  test('rejects a title shorter than two characters', () => {
    expect(meetingSchema.safeParse({ ...validMeeting, title: 'A' }).success).toBe(false)
  })
})

describe('updateMeetingSchema', () => {
  test('allows a partial update', () => {
    expect(updateMeetingSchema.safeParse({ title: 'Renamed' }).success).toBe(true)
  })

  test('still validates cutoff against start when both are present', () => {
    expect(
      updateMeetingSchema.safeParse({ startTime: '10:00', cutoffTime: '09:00' }).success,
    ).toBe(false)
  })
})
