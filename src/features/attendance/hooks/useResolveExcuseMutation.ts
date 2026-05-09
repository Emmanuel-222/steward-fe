import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resolveExcuse } from '../api'

function useResolveExcuseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, adminComment }: { id: number; status: 'Approved' | 'Rejected'; adminComment?: string }) => 
      resolveExcuse(id, status, adminComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    }
  })
}

export default useResolveExcuseMutation
