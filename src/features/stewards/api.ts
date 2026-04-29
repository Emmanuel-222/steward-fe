import api from '../../services/axios'
import type {
  CreateStewardValues,
  Steward,
  StewardAttendanceRecord,
  StewardAttendanceReport,
  StewardAttendanceSummary,
  StewardsResponse,
  UpdateStewardValues,
} from './types'

const roleToneMap: Record<string, string> = {
  Steward: 'bg-emerald-100 text-emerald-700',
  Leader: 'bg-blue-100 text-blue-700',
  Pastor: 'bg-rose-100 text-rose-700',
  Admin: 'bg-amber-100 text-amber-700',
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function createInitials(name: string) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return initials || 'ST'
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

function normalizeSteward(rawSteward: Record<string, unknown>): Steward {
  const id =
    String(
      rawSteward.id ??
        rawSteward.userId ??
        rawSteward._id ??
        rawSteward.email ??
        crypto.randomUUID(),
    )
  const name = String(
    rawSteward.name ??
      rawSteward.fullName ??
      [rawSteward.firstName, rawSteward.lastName].filter(Boolean).join(' ') ??
      'Unnamed Steward',
  ).trim()
  const email = String(rawSteward.email ?? '')
  const department = toTitleCase(String(rawSteward.department ?? 'Unassigned'))
  const role = toTitleCase(String(rawSteward.role ?? 'Steward'))
  const phone = String(rawSteward.phone ?? rawSteward.phoneNumber ?? 'N/A')
  const dateAdded = formatDate(
    rawSteward.createdAt ?? rawSteward.dateAdded ?? rawSteward.created_at,
  )

  return {
    id,
    initials: createInitials(name),
    name,
    email,
    department,
    role,
    roleTone: roleToneMap[role] ?? 'bg-slate-100 text-slate-700',
    phone,
    dateAdded,
  }
}

function extractStewardArray(payload: unknown) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const { users, data, results } = payload as StewardsResponse
    if (Array.isArray(users)) return users
    if (Array.isArray(data)) return data
    if (Array.isArray(results)) return results
  }

  return []
}

function normalizeAttendanceStatus(value: unknown) {
  return toTitleCase(String(value ?? 'Unknown'))
}

function formatAttendanceTime(value: unknown) {
  if (!value || typeof value !== 'string') {
    return '-'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function normalizeAttendanceRecord(
  rawRecord: Record<string, unknown>,
): StewardAttendanceRecord {
  const createdAt =
    rawRecord.markedAt ?? rawRecord.createdAt ?? rawRecord.timestamp ?? rawRecord.date
  
  const meetingData = rawRecord.meeting as Record<string, unknown> | undefined
  const meeting =
    rawRecord.meetingName ??
    rawRecord.meetingType ??
    rawRecord.meetingTitle ??
    meetingData?.type ??
    meetingData?.name ??
    'Meeting'

  return {
    id: String(rawRecord.id ?? rawRecord._id ?? crypto.randomUUID()),
    date: formatDate(createdAt),
    meeting: String(meeting),
    status: normalizeAttendanceStatus(rawRecord.status),
    time: formatAttendanceTime(createdAt),
  }
}

function normalizeAttendanceSummary(
  rawSummary: Record<string, unknown> | undefined,
): StewardAttendanceSummary {
  return {
    total: Number(rawSummary?.total ?? 0),
    present: Number(rawSummary?.present ?? 0),
    absent: Number(rawSummary?.absent ?? 0),
  }
}

export async function getStewards(search?: string) {
  const normalizedSearch = search?.trim()
  const endpoint =
    normalizedSearch
      ? `/users/search/${encodeURIComponent(normalizedSearch)}`
      : '/users'

  const { data } = await api.get(endpoint)

  return extractStewardArray(data).map((steward) =>
    normalizeSteward(steward as Record<string, unknown>),
  )
}

export async function getStewardById(id: string) {
  const { data } = await api.get(`/users/${id}`)
  return normalizeSteward(data as Record<string, unknown>)
}

export async function getStewardAttendanceReport(id: string) {
  const { data } = await api.get(`/attendance/user/${id}`)
  const payload = data as {
    user?: Record<string, unknown>
    summary?: Record<string, unknown>
    records?: Record<string, unknown>[]
  }

  return {
    user: normalizeSteward((payload.user ?? {}) as Record<string, unknown>),
    summary: normalizeAttendanceSummary(payload.summary),
    records: Array.isArray(payload.records)
      ? payload.records.map((record) =>
          normalizeAttendanceRecord(record as Record<string, unknown>),
        )
      : [],
  } satisfies StewardAttendanceReport
}

export async function createSteward(payload: CreateStewardValues) {
  const requestBody = {
    ...payload,
    fullName: payload.name,
    phoneNumber: payload.phone,
  }

  const { data } = await api.post('/users', requestBody)
  return normalizeSteward(data as Record<string, unknown>)
}

export async function updateSteward({
  id,
  payload,
}: {
  id: string
  payload: UpdateStewardValues
}) {
  const requestBody = {
    ...payload,
    fullName: payload.name,
    phoneNumber: payload.phone,
  }

  const { data } = await api.patch(`/users/${id}`, requestBody)
  return normalizeSteward(data as Record<string, unknown>)
}

export async function deleteSteward(id: string) {
  await api.delete(`/users/${id}`)
  return id
}
