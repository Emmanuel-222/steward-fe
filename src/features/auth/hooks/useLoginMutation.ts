import { useMutation } from '@tanstack/react-query'
import { login } from '../api'
import { clearAccessToken, clearLoggedOut, setAccessToken } from '../../../services/tokenStore'

function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) => {
      clearAccessToken()
      return login(payload)
    },
    onSuccess: (response) => {
      clearLoggedOut()
      setAccessToken(response.token)
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }
    },
  })
}

export default useLoginMutation
