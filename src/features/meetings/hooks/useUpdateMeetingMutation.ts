import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMeeting } from '../api'
import { meetingQueryKeys } from './useMeetingsQuery'

function useUpdateMeetingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMeeting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meetingQueryKeys.all })
    },
  })
}

export default useUpdateMeetingMutation
