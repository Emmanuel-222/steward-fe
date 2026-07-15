import type { Steward } from '../stewards/types'

export type MyAttendanceRecord = {
  id: string
  status: string
  markedAt: string
  meeting: {
    title: string
    type: string
    date: string
    startTime: string
    status: string
  }
  excuseRequest?: { reason: string }
}

export type MyExcuseRequest = {
  id: string
  meetingId: number
  reason: string
  status: string
  adminComment?: string
  createdAt: string
  meeting: {
    title: string
    type: string
    date: string
  }
}

/** Raw attendance record returned by the API */
export type AttendanceRecord = {
  id: string
  status: string
  markedAt: string
  userId: string | number
  meetingId: string | number
  createdAt: string
  excuseReason?: string
}

/** A steward merged with their attendance status for a specific meeting */
export type MeetingAttendanceEntry = {
  steward: Steward
  status: 'Present' | 'Unmarked' | 'Absent' | 'Excused'
  markedAt: string | null
  excuseReason?: string
}

/** Computed stats for a meeting's attendance */
export type MeetingAttendanceStats = {
  total: number
  present: number
  absent: number
  excused: number
  unmarked: number
  rate: string
}

/** The complete attendance state for a meeting */
export type MeetingAttendanceData = {
  entries: MeetingAttendanceEntry[]
  stats: MeetingAttendanceStats
}
