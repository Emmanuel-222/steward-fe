import { useQuery } from '@tanstack/react-query'
import { getPendingExcuses } from '../api'

function useExcuseRequestsQuery(enabled = true) {
  return useQuery({
    queryKey: ['attendance', 'excuses', 'pending'],
    queryFn: getPendingExcuses,
    refetchInterval: 15000,
    enabled,
  })
}

export default useExcuseRequestsQuery
