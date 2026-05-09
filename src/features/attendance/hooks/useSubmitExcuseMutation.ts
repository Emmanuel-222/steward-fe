import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitExcuse } from '../api'

function useSubmitExcuseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ meetingId, reason }: { meetingId: string; reason: string }) => 
      submitExcuse(meetingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    }
  })
}

export default useSubmitExcuseMutation
