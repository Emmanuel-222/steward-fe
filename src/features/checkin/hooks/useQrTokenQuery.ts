import { useQuery } from '@tanstack/react-query'
import { getQrToken } from '../api'

export const qrTokenQueryKeys = {
  token: (meetingId: string) => ['qr-token', meetingId] as const,
}

function useQrTokenQuery(meetingId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: qrTokenQueryKeys.token(meetingId ?? ''),
    queryFn: () => getQrToken(meetingId!),
    enabled: enabled && !!meetingId,
    staleTime: 55 * 60 * 1000,
    retry: false,
  })
}

export default useQrTokenQuery
