import { sessionStatus } from './sessionStatus'
import type {
  RollupSession,
  RollupTrainee,
  TraineeRow,
  TrainingSessionListItem,
  TrainingTraineeListItem,
} from './types'

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatDateAdded(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function formatBirthday(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getUTCFullYear()}`
}

export function toRollupTraineesGlobal(rows: TrainingTraineeListItem[]): RollupTrainee[] {
  return rows.map((r) => ({
    id: r.userId,
    name: r.name,
    email: r.email,
    cohortId: r.cohortId,
    cohortName: r.cohortName,
    track: r.track,
    missed: r.missed,
    maxMissedClasses: r.maxMissedClasses,
    graduation: r.graduation,
    enrollmentStatus: r.status,
    department: r.department ? titleCase(r.department) : 'Unassigned',
    role: r.role ? titleCase(r.role) : 'Trainee',
    phone: r.phone || 'N/A',
    dateAdded: r.createdAt ? formatDateAdded(r.createdAt) : 'N/A',
    birthday: formatBirthday(r.birthday),
  }))
}

export function toRollupTraineesCohort(
  rows: TraineeRow[],
  cohortId: number,
  cohortName: string,
): RollupTrainee[] {
  return rows.map((r) => ({
    id: r.userId,
    name: r.name,
    email: r.email,
    cohortId,
    cohortName,
    track: r.track,
    missed: r.missed,
    maxMissedClasses: r.maxMissedClasses,
    graduation: r.graduation,
    enrollmentStatus: r.enrollmentStatus,
  }))
}

export function toRollupSessionsGlobal(rows: TrainingSessionListItem[]): RollupSession[] {
  return rows.map((r) => ({
    id: r.classId,
    cohortId: r.cohortId,
    cohortName: r.cohortName,
    week: r.week,
    topic: r.topic,
    teacher: r.teacher,
    date: r.date,
    startTime: r.startTime,
    endTime: r.endTime,
    location: r.location,
    status: sessionStatus(r.date, r.startTime, r.endTime),
  }))
}
