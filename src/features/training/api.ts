import api from '../../services/axios'
import type {
  ClassRoster,
  CohortListItem,
  GraduationStatus,
  TeachingResponse,
  TrainingCohort,
  TrainingMe,
  TrainingSession,
  TrainingTopic,
  TraineeRow,
} from './types'

export function graduationLabel(status: GraduationStatus): string {
  if (status === 'at_risk') return 'At risk — one more miss fails you'
  if (status === 'will_not_graduate') return 'You will not graduate at this rate'
  return 'On track to graduate'
}

export async function getTrainingMe() {
  const { data } = await api.get('/training/me')
  return data as TrainingMe
}

export async function getTrainingClasses() {
  const { data } = await api.get('/training/me/classes')
  return (Array.isArray(data) ? data : []) as TrainingSession[]
}

export async function getCohorts() {
  const { data } = await api.get('/training/cohorts')
  return (Array.isArray(data) ? data : []) as CohortListItem[]
}

export async function getCohort(id: string | number) {
  const { data } = await api.get(`/training/cohorts/${id}`)
  return data as TrainingCohort & { topics: TrainingTopic[] }
}

export async function getCohortClasses(id: string | number) {
  const { data } = await api.get(`/training/cohorts/${id}/classes`)
  return (Array.isArray(data) ? data : []) as Array<{
    id: number
    meeting: { id: number; title: string; date: string; startTime: string; endTime: string; location: string }
    topic: TrainingTopic | null
  }>
}

export async function getTrainees(cohortId: string | number) {
  const { data } = await api.get(`/training/cohorts/${cohortId}/trainees`)
  return (Array.isArray(data) ? data : []) as TraineeRow[]
}

export type CreateCohortPayload = {
  name: string
  startDate: string
  weekCount: number
  maxMissedClasses: number
}

export async function createCohort(payload: CreateCohortPayload) {
  const { data } = await api.post('/training/cohorts', payload)
  return data as TrainingCohort
}

export async function deleteCohort(cohortId: string | number) {
  const { data } = await api.delete(`/training/cohorts/${cohortId}`)
  return data
}

export async function updateCohort({
  id,
  payload,
}: {
  id: string | number
  payload: Partial<CreateCohortPayload> & { status?: string }
}) {
  const { data } = await api.patch(`/training/cohorts/${id}`, payload)
  return data as TrainingCohort
}

export type SaveSessionPayload = {
  weekNumber: number
  day?: string
  startTime: string
  endTime?: string
  title: string
  description?: string
  notes?: string
  teacherId?: number | null
  requiredForNew?: boolean
  requiredForRefresher?: boolean
}

export async function saveTopic({
  cohortId,
  weekNumber,
  day,
  startTime,
  endTime,
  title,
  description,
  notes,
  teacherId,
  requiredForNew,
  requiredForRefresher,
}: SaveSessionPayload & { cohortId: string | number }) {
  const { data } = await api.post(`/training/cohorts/${cohortId}/topics`, {
    weekNumber,
    day,
    startTime,
    endTime,
    title,
    description,
    notes,
    teacherId: teacherId ?? null,
    requiredForNew,
    requiredForRefresher,
  })
  return data as TrainingTopic
}

export async function generateSessions(cohortId: string | number) {
  const { data } = await api.post(`/training/cohorts/${cohortId}/generate`)
  return data as { created: number }
}

export async function seedCurriculum(cohortId: string | number) {
  const { data } = await api.post(`/training/cohorts/${cohortId}/seed-curriculum`)
  return data as { created: number }
}

export async function getTeaching() {
  const { data } = await api.get('/training/teaching')
  return data as TeachingResponse
}

export async function getClassRoster(classId: number) {
  const { data } = await api.get(`/training/classes/${classId}/roster`)
  return data as ClassRoster
}

export type ScheduleClassPayload = {
  topicId?: number | null
  title?: string
  date: string
  startTime: string
  cutoffTime?: string
  endTime: string
  location: string
}

export async function scheduleClass({
  cohortId,
  payload,
}: {
  cohortId: string | number
  payload: ScheduleClassPayload
}) {
  const { data } = await api.post(`/training/cohorts/${cohortId}/classes`, payload)
  return data
}

export async function graduateTrainee({
  cohortId,
  userId,
}: {
  cohortId: string | number
  userId: number
}) {
  const { data } = await api.post(`/training/cohorts/${cohortId}/trainees/${userId}/graduate`)
  return data
}

export async function importTrainees({ file, cohortId }: { file: File; cohortId: string | number }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('cohortId', String(cohortId))
  const { data } = await api.post('/users/import', formData)
  return data
}
