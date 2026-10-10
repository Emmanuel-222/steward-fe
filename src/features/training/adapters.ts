import { sessionStatus } from './sessionStatus'
import type {
  RollupSession,
  RollupTrainee,
  TraineeRow,
  TrainingSessionListItem,
  TrainingTraineeListItem,
} from './types'

export type CohortClassInput = {
  id: number
  meeting: { date: string; startTime: string; endTime: string; location: string }
  topic: { weekNumber: number; title: string; teacher?: { fullName: string } | null } | null
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

export function toRollupSessionsCohort(
  rows: CohortClassInput[],
  cohortId: number,
  cohortName: string,
): RollupSession[] {
  return rows.map((c) => ({
    id: c.id,
    cohortId,
    cohortName,
    week: c.topic?.weekNumber ?? null,
    topic: c.topic?.title ?? null,
    teacher: c.topic?.teacher?.fullName ?? null,
    date: c.meeting.date,
    startTime: c.meeting.startTime,
    endTime: c.meeting.endTime,
    location: c.meeting.location,
    status: sessionStatus(c.meeting.date, c.meeting.startTime, c.meeting.endTime),
  }))
}
