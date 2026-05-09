import { useQuery } from '@tanstack/react-query'
import { getPendingExcuses } from '../api'

function useExcuseRequestsQuery() {
  return useQuery({
    queryKey: ['attendance', 'excuses', 'pending'],
    queryFn: getPendingExcuses,
    refetchInterval: 15000, // Check for new excuses every 15 seconds
  })
}

export default useExcuseRequestsQuery
