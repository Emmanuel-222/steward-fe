import { useMutation } from '@tanstack/react-query'
import { login } from '../api'
import { setAccessToken } from '../../../services/tokenStore'

function useLoginMutation() {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.token)
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }
    },
  })
}

export default useLoginMutation
