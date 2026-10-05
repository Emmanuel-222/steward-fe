import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCohort,
  getCohort,
  getCohortClasses,
  getCohorts,
  getTrainees,
  getTrainingClasses,
  getTrainingMe,
  graduateTrainee,
  importTrainees,
  saveTopic,
  scheduleClass,
  updateCohort,
  type CreateCohortPayload,
  type ScheduleClassPayload,
} from '../api'

const keys = {
  me: ['training', 'me'] as const,
  classes: ['training', 'classes'] as const,
  cohorts: ['training', 'cohorts'] as const,
  cohort: (id: string | number) => ['training', 'cohort', String(id)] as const,
  cohortClasses: (id: string | number) => ['training', 'cohort', String(id), 'classes'] as const,
  trainees: (id: string | number) => ['training', 'cohort', String(id), 'trainees'] as const,
}

export function useTrainingMeQuery(enabled = true) {
  return useQuery({ queryKey: keys.me, queryFn: getTrainingMe, enabled, retry: 1 })
}

export function useTrainingClassesQuery(enabled = true) {
  return useQuery({ queryKey: keys.classes, queryFn: getTrainingClasses, enabled })
}

export function useCohortsQuery(enabled = true) {
  return useQuery({ queryKey: keys.cohorts, queryFn: getCohorts, enabled })
}

export function useCohortQuery(id: string | number, enabled = true) {
  return useQuery({ queryKey: keys.cohort(id), queryFn: () => getCohort(id), enabled })
}

export function useCohortClassesQuery(id: string | number, enabled = true) {
  return useQuery({ queryKey: keys.cohortClasses(id), queryFn: () => getCohortClasses(id), enabled })
}

export function useTraineesQuery(id: string | number, enabled = true) {
  return useQuery({ queryKey: keys.trainees(id), queryFn: () => getTrainees(id), enabled })
}

export function useCreateCohortMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCohortPayload) => createCohort(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.cohorts }),
  })
}

export function useUpdateCohortMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateCohort,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: keys.cohorts })
      qc.invalidateQueries({ queryKey: keys.cohort(vars.id) })
    },
  })
}

export function useSaveTopicMutation(cohortId: string | number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { weekNumber: number; title: string; description?: string; notes?: string }) =>
      saveTopic({ cohortId, ...payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.cohort(cohortId) }),
  })
}

export function useScheduleClassMutation(cohortId: string | number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ScheduleClassPayload) => scheduleClass({ cohortId, payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.cohortClasses(cohortId) })
      qc.invalidateQueries({ queryKey: keys.cohort(cohortId) })
    },
  })
}

export function useGraduateTraineeMutation(cohortId: string | number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: number) => graduateTrainee({ cohortId, userId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.trainees(cohortId) })
      qc.invalidateQueries({ queryKey: keys.cohorts })
    },
  })
}

export function useImportTraineesMutation(cohortId: string | number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importTrainees({ file, cohortId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.trainees(cohortId) }),
  })
}
