import api from '../../services/axios'
import { getStewards } from '../stewards/api'
import type {
  AttendanceRecord,
  MeetingAttendanceData,
  MeetingAttendanceEntry,
} from './types'

function normalizeRecord(raw: Record<string, unknown>): AttendanceRecord {
  return {
    id: String(raw.id ?? raw._id ?? crypto.randomUUID()),
    status: String(raw.status ?? 'present'),
    markedAt: String(raw.markedAt ?? raw.createdAt ?? ''),
    userId: String(raw.userId ?? raw.user_id ?? ''),
    meetingId: String(raw.meetingId ?? raw.meeting_id ?? ''),
    createdAt: String(raw.createdAt ?? ''),
  }
}

function formatCheckinTime(value: string) {
  if (!value) return null

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) return null

  return parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function extractRecords(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    if (Array.isArray(obj.records)) return obj.records as Record<string, unknown>[]
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[]
    if (Array.isArray(obj.attendance)) return obj.attendance as Record<string, unknown>[]
  }

  return []
}

export async function getMeetingAttendance(meetingId: string) {
  const { data } = await api.get(`/attendance/meeting/${meetingId}`)
  const rawRecords = extractRecords(data)

  return rawRecords.map((record) => normalizeRecord(record))
}

export async function markPresent(userId: string, meetingId: string) {
  const { data } = await api.post('/attendance', {
    userId: Number(userId),
    meetingId: Number(meetingId),
  })

  return data
}

export async function getMeetingAttendanceWithStewards(
  meetingId: string,
): Promise<MeetingAttendanceData> {
  const [records, stewards] = await Promise.all([
    getMeetingAttendance(meetingId),
    getStewards(),
  ])

  const presentMap = new Map<string, AttendanceRecord>()

  for (const record of records) {
    presentMap.set(String(record.userId), record)
  }

  const entries: MeetingAttendanceEntry[] = stewards.map((steward) => {
    const record = presentMap.get(String(steward.id))

    return {
      steward,
      status: record ? 'Present' : 'Unmarked',
      markedAt: record ? formatCheckinTime(record.markedAt) : null,
    }
  })

  // Sort: unmarked first (so they're actionable), then present
  entries.sort((a, b) => {
    if (a.status === 'Unmarked' && b.status === 'Present') return -1
    if (a.status === 'Present' && b.status === 'Unmarked') return 1
    return 0
  })

  const present = entries.filter((entry) => entry.status === 'Present').length
  const total = entries.length
  const unmarked = total - present
  const rate = total > 0 ? `${Math.round((present / total) * 100)}%` : '0%'

  return {
    entries,
    stats: { total, present, unmarked, rate },
  }
}
