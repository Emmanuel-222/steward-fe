import { useQuery } from '@tanstack/react-query'
import type { PaginationData } from '../../../types'
import type { Steward } from '../types'
import { getStewardAttendanceReport, getStewardById, getStewards, getStewardsPage } from '../api'

export const stewardQueryKeys = {
  all: ['stewards'] as const,
  list: (search: string) => ['stewards', 'list', search] as const,
  listPage: (search: string, page: number, limit: number) =>
    ['stewards', 'list', search, page, limit] as const,
  detail: (id: string) => ['stewards', 'detail', id] as const,
  attendance: (id: string) => ['stewards', 'attendance', id] as const,
}

type StewardsQueryResult = { items: Steward[]; pagination: PaginationData | null }

function useStewardsQuery(search: string, page?: number, limit?: number, role?: string) {
  const isPaginated = page !== undefined

  return useQuery<StewardsQueryResult>({
    queryKey: isPaginated
      ? ['stewards', 'list', search, page, limit ?? 20, role ?? 'All Roles']
      : stewardQueryKeys.list(search),
    queryFn: async () => {
      if (isPaginated) return getStewardsPage(search, page!, limit ?? 20, role)
      const items = await getStewards(search)
      return { items, pagination: null }
    },
    placeholderData: (previousData) => previousData,
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
