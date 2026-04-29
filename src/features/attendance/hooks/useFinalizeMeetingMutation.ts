import { useMutation, useQueryClient } from '@tanstack/react-query'
import { finalizeMeeting } from '../api'

export default function useFinalizeMeetingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (meetingId: string) => finalizeMeeting(meetingId),
    onSuccess: (_, meetingId) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      queryClient.invalidateQueries({ queryKey: ['meetingAttendance', meetingId] })
    },
  })
}
