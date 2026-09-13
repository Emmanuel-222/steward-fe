import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getMe } from '../api'

function useMeQuery(enabled: boolean = true) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const invalidateMe = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
  }, [queryClient])

  return { ...query, invalidateMe }
}

export default useMeQuery
