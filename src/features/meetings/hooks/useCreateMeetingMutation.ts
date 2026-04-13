import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMeeting } from '../api'
import { meetingQueryKeys } from './useMeetingsQuery'

function useCreateMeetingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMeeting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meetingQueryKeys.all })
    },
  })
}

export default useCreateMeetingMutation
