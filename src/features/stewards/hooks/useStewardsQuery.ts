import { useQuery } from '@tanstack/react-query'
import { getStewardAttendanceReport, getStewardById, getStewards } from '../api'

export const stewardQueryKeys = {
  all: ['stewards'] as const,
  list: (search: string) => ['stewards', 'list', search] as const,
  detail: (id: string) => ['stewards', 'detail', id] as const,
  attendance: (id: string) => ['stewards', 'attendance', id] as const,
}

function useStewardsQuery(search: string) {
  return useQuery({
    queryKey: stewardQueryKeys.list(search),
    queryFn: () => getStewards(search),
  })
}

export function useStewardDetailQuery(id: string | null) {
  return useQuery({
    queryKey: stewardQueryKeys.detail(id ?? ''),
    queryFn: () => getStewardById(id as string),
    enabled: Boolean(id),
  })
}

export function useStewardAttendanceQuery(id: string | null) {
  return useQuery({
    queryKey: stewardQueryKeys.attendance(id ?? ''),
    queryFn: () => getStewardAttendanceReport(id as string),
    enabled: Boolean(id),
  })
}

export default useStewardsQuery
