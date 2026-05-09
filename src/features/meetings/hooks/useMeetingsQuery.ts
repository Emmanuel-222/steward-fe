import { useQuery } from '@tanstack/react-query'
import { getMeetings } from '../api'

export const meetingQueryKeys = {
  all: ['meetings'] as const,
  list: () => ['meetings', 'list'] as const,
}

function useMeetingsQuery() {
  return useQuery({
    queryKey: meetingQueryKeys.list(),
    queryFn: getMeetings,
    refetchInterval: 10000, // Poll every 10 seconds
  })
}

export default useMeetingsQuery
