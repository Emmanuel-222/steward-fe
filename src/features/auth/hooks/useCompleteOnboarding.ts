import { useMutation } from '@tanstack/react-query'
import { completeOnboarding } from '../api'

function useCompleteOnboarding() {
  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: (user) => {
      const stored = localStorage.getItem('user')
      const current = stored ? JSON.parse(stored) : {}
      localStorage.setItem('user', JSON.stringify({ ...current, ...user }))
    },
  })
}

export default useCompleteOnboarding