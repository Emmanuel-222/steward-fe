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
  })
}

export default useMeetingsQuery
