import type { SessionStatus } from './types'

export function sessionStatus(
  date: string,
  startTime: string,
  endTime?: string | null,
): SessionStatus {
  const start = combine(date, startTime)
  if (start === null) return 'Upcoming'
  const end = combine(date, endTime) ?? new Date(start.getTime() + 60 * 60 * 1000)
  const now = Date.now()
  if (now < start.getTime()) return 'Upcoming'
  if (now > end.getTime()) return 'Completed'
  return 'Ongoing'
}

function combine(date: string, time?: string | null): Date | null {
  if (!date || !time) return null
  const day = date.slice(0, 10)
  const d = new Date(`${day}T00:00:00`)
  if (Number.isNaN(d.getTime())) return null
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return null
  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[3]?.toUpperCase()
  if (meridiem === 'PM' && hours < 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  if (hours > 23 || minutes > 59) return null
  d.setHours(hours, minutes, 0, 0)
  return d
}
