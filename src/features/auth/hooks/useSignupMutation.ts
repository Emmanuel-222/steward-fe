import { useMutation } from '@tanstack/react-query'
import { signup } from '../api'

function useSignupMutation() {
  return useMutation({ mutationFn: signup })
}

export default useSignupMutation
