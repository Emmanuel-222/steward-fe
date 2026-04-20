import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markPresent } from '../api'

function useMarkPresentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, meetingId }: { userId: string; meetingId: string }) =>
      markPresent(userId, meetingId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'meeting', variables.meetingId],
      })
    },
  })
}

export default useMarkPresentMutation
