import type { Steward } from '../stewards/types'

/** Raw attendance record returned by the API */
export type AttendanceRecord = {
  id: string
  status: string
  markedAt: string
  userId: string | number
  meetingId: string | number
  createdAt: string
}

/** A steward merged with their attendance status for a specific meeting */
export type MeetingAttendanceEntry = {
  steward: Steward
  status: 'Present' | 'Unmarked' | 'Absent'
  markedAt: string | null
}

/** Computed stats for a meeting's attendance */
export type MeetingAttendanceStats = {
  total: number
  present: number
  unmarked: number
  rate: string
}

/** The complete attendance state for a meeting */
export type MeetingAttendanceData = {
  entries: MeetingAttendanceEntry[]
  stats: MeetingAttendanceStats
}
