import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../services/axios'

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.patch('/auth/change-password', payload)
}

export default function useChangePasswordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}
