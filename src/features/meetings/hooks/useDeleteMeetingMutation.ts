import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMeeting } from '../api'
import { meetingQueryKeys } from './useMeetingsQuery'

function useDeleteMeetingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMeeting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meetingQueryKeys.all })
    },
  })
}

export default useDeleteMeetingMutation
