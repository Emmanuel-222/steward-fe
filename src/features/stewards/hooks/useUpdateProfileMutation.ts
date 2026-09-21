import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../services/axios'

export type UpdateProfilePayload = {
  fullName?: string
  phone?: string
  birthday?: string | null
}

type UserProfile = {
  id: number
  fullName: string
  email: string
  phone: string
  department: string
  role: string
  birthday: string | null
  updatedAt: string
}

async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const { data } = await api.patch('/users/me/profile', payload)
  return data.data
}

export default function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}
