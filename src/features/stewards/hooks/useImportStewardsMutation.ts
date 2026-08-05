import { useMutation, useQueryClient } from '@tanstack/react-query'
import { importStewards } from '../api'
import { stewardQueryKeys } from './useStewardsQuery'

function useImportStewardsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importStewards,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: stewardQueryKeys.all })
    },
  })
}

export default useImportStewardsMutation
