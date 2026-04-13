import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSteward } from '../api'
import { stewardQueryKeys } from './useStewardsQuery'

function useUpdateStewardMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSteward,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: stewardQueryKeys.all })
    },
  })
}

export default useUpdateStewardMutation
