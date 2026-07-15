import { useQuery } from '@tanstack/react-query'
import { getMyExcuses } from '../api'

function useMyExcusesQuery() {
  return useQuery({
    queryKey: ['attendance', 'excuses', 'my'],
    queryFn: getMyExcuses,
  })
}

export default useMyExcusesQuery
