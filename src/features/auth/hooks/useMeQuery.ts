import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api'

function useMeQuery(enabled: boolean = true) {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled,
    staleTime: Infinity, // User data doesn't change often
  })
}

export default useMeQuery
