import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSteward } from '../api'
import { stewardQueryKeys } from './useStewardsQuery'

function useDeleteStewardMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSteward,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: stewardQueryKeys.all })
    },
  })
}

export default useDeleteStewardMutation
