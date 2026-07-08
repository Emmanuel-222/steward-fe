import { useQuery } from '@tanstack/react-query'
import type { Meeting } from '../types'
import type { PaginationData } from '../../../types'
import { getMeetings, getMeetingsPage } from '../api'

export const meetingQueryKeys = {
  all: ['meetings'] as const,
  list: () => ['meetings', 'list'] as const,
  listPage: (page: number, limit: number) => ['meetings', 'list', page, limit] as const,
}

type MeetingsQueryResult = { items: Meeting[]; pagination: PaginationData | null }

function useMeetingsQuery(page?: number, limit?: number) {
  const isPaginated = page !== undefined

  return useQuery<MeetingsQueryResult>({
    queryKey: isPaginated
      ? meetingQueryKeys.listPage(page, limit ?? 20)
      : meetingQueryKeys.list(),
    queryFn: async () => {
      if (isPaginated) return getMeetingsPage(page!, limit ?? 20)
      const items = await getMeetings()
      return { items, pagination: null }
    },
    refetchInterval: isPaginated ? false : 10000,
  })
}

export default useMeetingsQuery
