import { useMutation } from '@tanstack/react-query'
import { login } from '../api'

function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem('token', response.token)
    },
  })
}

export default useLoginMutation
