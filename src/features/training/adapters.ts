import { sessionStatus } from './sessionStatus'
import type {
  RollupSession,
  RollupTrainee,
  TraineeRow,
  TrainingSessionListItem,
  TrainingTraineeListItem,
} from './types'

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
