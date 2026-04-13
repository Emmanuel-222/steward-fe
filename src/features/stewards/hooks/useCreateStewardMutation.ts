import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSteward } from '../api'
import { stewardQueryKeys } from './useStewardsQuery'

function useCreateStewardMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSteward,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: stewardQueryKeys.all })
    },
  })
}

export default useCreateStewardMutation
