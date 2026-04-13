import api from '../../services/axios'
import type { CreateMeetingValues, Meeting, UpdateMeetingValues } from './types'

const statusToneMap: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Upcoming: 'bg-sky-100 text-sky-700',
  Completed: 'bg-rose-100 text-rose-700',
  Archived: 'bg-slate-200 text-slate-700',
}

function formatDate(value: unknown) {
  if (!value || typeof value !== 'string') {
    return 'N/A'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function formatTime(value: unknown) {
  if (!value || typeof value !== 'string') {
    return ''
  }

  const parsed = new Date(`1970-01-01T${value}`)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function normalizeStatus(rawMeeting: Record<string, unknown>) {
  const explicitStatus = String(rawMeeting.status ?? '').trim()
  if (explicitStatus) {
    const normalized =
      explicitStatus.charAt(0).toUpperCase() + explicitStatus.slice(1).toLowerCase()
    return normalized
  }

  const meetingDate = rawMeeting.date ?? rawMeeting.meetingDate ?? rawMeeting.createdAt
  if (typeof meetingDate === 'string') {
    const parsed = new Date(meetingDate)
    const now = new Date()
    if (!Number.isNaN(parsed.getTime())) {
      if (parsed > now) return 'Upcoming'
    }
  }

  return 'Completed'
}

function normalizeMeeting(rawMeeting: Record<string, unknown>): Meeting {
  const id = String(
    rawMeeting.id ??
      rawMeeting.meetingId ??
      rawMeeting._id ??
      crypto.randomUUID(),
  )
  const title = String(
    rawMeeting.title ??
      rawMeeting.type ??
      rawMeeting.meetingType ??
      rawMeeting.name ??
      'Untitled Meeting',
  )
  const subtitle = String(
    rawMeeting.subtitle ?? rawMeeting.description ?? 'Registry meeting session',
  )
  const status = normalizeStatus(rawMeeting)
  const startTime =
    formatTime(rawMeeting.startTime ?? rawMeeting.time ?? rawMeeting.start)
  const cutoffTime = formatTime(
    rawMeeting.cutoffTime ?? rawMeeting.endTime ?? rawMeeting.cutoff,
  )
  const present = rawMeeting.presentCount ?? rawMeeting.present
  const absent = rawMeeting.absentCount ?? rawMeeting.absent

  return {
    id,
    status,
    statusTone: statusToneMap[status] ?? 'bg-slate-100 text-slate-700',
    title,
    subtitle,
    date: formatDate(rawMeeting.date ?? rawMeeting.meetingDate ?? rawMeeting.createdAt),
    time:
      startTime && cutoffTime
        ? `${startTime} - ${cutoffTime}`
        : startTime || cutoffTime || 'Time not set',
    location: String(rawMeeting.location ?? rawMeeting.venue ?? 'Location not set'),
    present: typeof present === 'number' ? present : null,
    absent: typeof absent === 'number' ? absent : null,
    primaryAction: present !== undefined || absent !== undefined
      ? 'View Attendance'
      : 'Prepare Check-in',
    secondaryAction: 'Edit',
  }
}

export async function getMeetings() {
  const { data } = await api.get('/meetings')
  const meetings = Array.isArray(data) ? data : []

  return meetings.map((meeting) =>
    normalizeMeeting(meeting as Record<string, unknown>),
  )
}

export async function createMeeting(payload: CreateMeetingValues) {
  const requestBody = {
    ...payload,
    type: payload.title,
  }

  const { data } = await api.post('/meetings', requestBody)
  return normalizeMeeting(data as Record<string, unknown>)
}

export async function updateMeeting({
  id,
  payload,
}: {
  id: string
  payload: UpdateMeetingValues
}) {
  const requestBody = {
    ...payload,
    type: payload.title,
  }

  const { data } = await api.patch(`/meetings/${id}`, requestBody)
  return normalizeMeeting(data as Record<string, unknown>)
}

export async function deleteMeeting(id: string) {
  await api.delete(`/meetings/${id}`)
  return id
}
