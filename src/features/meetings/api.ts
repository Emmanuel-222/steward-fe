import api from '../../services/axios'
import type { CreateMeetingValues, Meeting, UpdateMeetingValues } from './types'

const statusToneMap: Record<string, string> = {
  Upcoming: 'bg-sky-100 text-sky-700',
  Ongoing: 'bg-emerald-100 text-emerald-700',
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

  const normalizedTime = normalizeTimeValue(value)

  if (!normalizedTime) {
    return value
  }

  const parsed = new Date(`1970-01-01T${normalizedTime}`)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getRawDate(rawMeeting: Record<string, unknown>) {
  const dateValue = rawMeeting.date ?? rawMeeting.meetingDate
  if (typeof dateValue !== 'string') {
    return ''
  }

  const trimmed = dateValue.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  const isoDateMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
  if (isoDateMatch) {
    return isoDateMatch[1]
  }

  const parsed = new Date(trimmed)

  if (Number.isNaN(parsed.getTime())) {
    return trimmed
  }

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function normalizeTimeValue(value: unknown) {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim().toUpperCase()

  if (!trimmed) {
    return ''
  }

  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/)
  if (twentyFourHourMatch) {
    const [, hours, minutes, seconds = '00'] = twentyFourHourMatch
    return `${hours.padStart(2, '0')}:${minutes}:${seconds}`
  }

  const meridiemMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/)
  if (!meridiemMatch) {
    return ''
  }

  const [hours, minutes, meridiem] = meridiemMatch
  let numericHours = Number(hours)

  if (meridiem === 'AM') {
    if (numericHours === 12) {
      numericHours = 0
    }
  } else if (numericHours !== 12) {
    numericHours += 12
  }

  return `${String(numericHours).padStart(2, '0')}:${minutes}:00`
}

function getRawTime(...values: unknown[]) {
  const firstMatch = values.find(
    (value) => typeof value === 'string' && value.trim().length > 0,
  )

  if (typeof firstMatch !== 'string') {
    return ''
  }

  const normalized = normalizeTimeValue(firstMatch)
  return normalized ? normalized.slice(0, 5) : firstMatch.trim()
}

function normalizeExplicitStatus(value: unknown) {
  const normalized = String(value ?? '').trim().toLowerCase()

  if (!normalized) {
    return ''
  }

  if (normalized === 'ongoing' || normalized === 'ungoing') {
    return 'Ongoing'
  }

  if (normalized === 'upcoming') {
    return 'Upcoming'
  }

  if (normalized === 'completed') {
    return 'Completed'
  }

  if (normalized === 'archived') {
    return 'Archived'
  }

  return (
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1)
  )
}

function normalizeStatus(rawMeeting: Record<string, unknown>) {
  const date = getRawDate(rawMeeting)
  const startTime = getRawTime(rawMeeting.startTime, rawMeeting.time, rawMeeting.start)
  const endTime = getRawTime(
    rawMeeting.endTime,
    rawMeeting.cutoffTime,
    rawMeeting.end,
  )

  if (date && startTime && endTime) {
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${endTime}`)
    const now = new Date()

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      if (now < start) return 'Upcoming'
      if (now >= start && now <= end) return 'Ongoing'
      if (now > end) return 'Completed'
    }
  }

  const explicitStatus = normalizeExplicitStatus(rawMeeting.status)

  return explicitStatus || 'Completed'
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
  const rawDate = getRawDate(rawMeeting)
  const rawStartTime = getRawTime(
    rawMeeting.startTime,
    rawMeeting.time,
    rawMeeting.start,
  )
  const rawCutoffTime = getRawTime(rawMeeting.cutoffTime, rawMeeting.cutoff)
  const rawEndTime = getRawTime(
    rawMeeting.endTime,
    rawMeeting.end,
    rawMeeting.cutoffTime,
  )
  const startTime = formatTime(rawStartTime)
  const endTime = formatTime(rawEndTime)
  
  // Try all possible keys for attendance counts
  // Important: distinguish between "not provided" (null) and "explicitly zero" (0)
  const presentVal = rawMeeting.presentCount ?? rawMeeting.present ?? rawMeeting.totalPresent
  const absentVal = rawMeeting.absentCount ?? rawMeeting.absent ?? rawMeeting.totalAbsent
  const hasCounts = presentVal !== undefined || absentVal !== undefined

  return {
    id,
    status,
    statusTone: statusToneMap[status] ?? 'bg-slate-100 text-slate-700',
    title,
    subtitle,
    date: formatDate(rawDate || rawMeeting.createdAt),
    time:
      startTime && endTime
        ? `${startTime} - ${endTime}`
        : startTime || endTime || 'Time not set',
    location: String(rawMeeting.location ?? rawMeeting.venue ?? 'Location not set'),
    present: hasCounts ? (typeof presentVal === 'number' ? presentVal : 0) : null,
    absent: hasCounts ? (typeof absentVal === 'number' ? absentVal : 0) : null,
    primaryAction: status === 'Ongoing' ? 'Prepare Check-in' : 'View Attendance',
    secondaryAction: 'Edit',
    rawDate,
    rawStartTime,
    rawCutoffTime,
    rawEndTime,
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
