import { useMutation } from '@tanstack/react-query'
import { verifyEmail } from '../api'

function useVerifyEmailMutation() {
  return useMutation({ mutationFn: verifyEmail })
}

export default useVerifyEmailMutation
