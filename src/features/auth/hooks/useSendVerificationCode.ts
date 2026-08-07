import { useMutation } from '@tanstack/react-query'
import { sendVerificationCode } from '../api'

function useSendVerificationCode() {
  return useMutation({ mutationFn: sendVerificationCode })
}

export default useSendVerificationCode