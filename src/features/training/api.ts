import api from '../../services/axios'
import type {
  GraduationStatus,
  TrainingClassItem,
  TrainingCohort,
  TrainingMe,
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
  return (Array.isArray(data) ? data : []) as TrainingClassItem[]
}

export async function getCohorts() {
  const { data } = await api.get('/training/cohorts')
  return (Array.isArray(data) ? data : []) as TrainingCohort[]
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
  teacherId: number
  maxMissedClasses: number
}

export async function createCohort(payload: CreateCohortPayload) {
  const { data } = await api.post('/training/cohorts', payload)
  return data as TrainingCohort
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

export async function saveTopic({
  cohortId,
  weekNumber,
  title,
  description,
  notes,
}: {
  cohortId: string | number
  weekNumber: number
  title: string
  description?: string
  notes?: string
}) {
  const { data } = await api.post(`/training/cohorts/${cohortId}/topics`, {
    weekNumber,
    title,
    description,
    notes,
  })
  return data as TrainingTopic
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
