import { useMutation } from '@tanstack/react-query'
import { checkIn } from '../api'

function useCheckInMutation() {
  return useMutation({
    mutationFn: ({ token, email }: { token: string; email: string }) =>
      checkIn(token, email),
  })
}

export default useCheckInMutation
