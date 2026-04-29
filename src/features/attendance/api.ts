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

export async function finalizeMeeting(meetingId: string) {
  const { data } = await api.post(`/attendance/finalize/${meetingId}`)
  return data
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

  const entries: MeetingAttendanceEntry[] = stewards
    .filter((s) => s.role.toLowerCase() !== 'admin')
    .map((steward) => {
      const record = presentMap.get(String(steward.id))
    
    let status: 'Present' | 'Absent' | 'Unmarked' = 'Unmarked'
    if (record) {
      const recordStatus = String(record.status).toLowerCase()
      status = recordStatus === 'present' ? 'Present' : 'Absent'
    }

    return {
      steward,
      status,
      markedAt: record ? formatCheckinTime(record.markedAt) : null,
    }
  })

  // Sort: Unmarked -> Present -> Absent
  const statusOrder = { Unmarked: 0, Present: 1, Absent: 2 }
  entries.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  const present = entries.filter((entry) => entry.status === 'Present').length
  const absent = entries.filter((entry) => entry.status === 'Absent').length
  const total = entries.length
  const unmarked = entries.filter((entry) => entry.status === 'Unmarked').length
  const rate = total > 0 ? `${Math.round((present / total) * 100)}%` : '0%'

  return {
    entries,
    stats: { total, present, unmarked, absent, rate },
  }
}
