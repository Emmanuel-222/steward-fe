import { useQuery } from '@tanstack/react-query'
import { getStewards } from '../api'

export const stewardQueryKeys = {
  all: ['stewards'] as const,
  list: (search: string) => ['stewards', 'list', search] as const,
}

function useStewardsQuery(search: string) {
  return useQuery({
    queryKey: stewardQueryKeys.list(search),
    queryFn: () => getStewards(search),
  })
}

export default useStewardsQuery
