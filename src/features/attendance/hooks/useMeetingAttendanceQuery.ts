import { useQuery } from '@tanstack/react-query'
import { getMeetingAttendanceWithStewards } from '../api'

function useMeetingAttendanceQuery(meetingId: string | null) {
  return useQuery({
    queryKey: ['attendance', 'meeting', meetingId],
    queryFn: () => getMeetingAttendanceWithStewards(meetingId!),
    enabled: Boolean(meetingId),
    refetchInterval: 10000, // Poll every 10 seconds
  })
}

export default useMeetingAttendanceQuery
