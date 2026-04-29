import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markPresent } from '../api'

function useMarkPresentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, meetingId, status }: { userId: string; meetingId: string; status?: string }) =>
      markPresent(userId, meetingId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'meeting', variables.meetingId],
      })
    },
  })
}

export default useMarkPresentMutation
