import type { Meeting } from '../meetings/types'
import type { RollupSession, SessionStatus } from './types'

const statusTone: Record<SessionStatus, string> = {
  Upcoming: 'bg-sky-100 text-sky-700',
  Ongoing: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-slate-200 text-slate-700',
}

function formatSessionDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export function weekdayFromDate(value: string | null | undefined): string | null {
  if (!value) return null
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export function sessionDayLabel(day: string | null | undefined, date: string | null | undefined): string {
  return weekdayFromDate(date) ?? day ?? ''
}

export function sessionToMeeting(session: RollupSession): Meeting {
  const weekPrefix = session.week != null ? `Week ${session.week} · ` : ''
  const time =
    session.startTime && session.endTime
      ? `${session.startTime} - ${session.endTime}`
      : session.startTime || 'Time not set'

  return {
    id: String(session.id),
    status: session.status,
    statusTone: statusTone[session.status],
    title: `${weekPrefix}${session.topic ?? 'Training session'}`,
    type: weekdayFromDate(session.date) ?? 'Training',
    subtitle: session.cohortName,
    date: formatSessionDate(session.date),
    time,
    location: session.location ?? '',
    present: null,
    absent: null,
    primaryAction: 'View schedule',
    secondaryAction: '',
    rawDate: session.date,
    rawStartTime: session.startTime ?? '',
    rawCutoffTime: '',
    rawEndTime: session.endTime ?? '',
  }
}
