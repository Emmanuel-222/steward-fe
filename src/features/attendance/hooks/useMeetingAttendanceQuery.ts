import { useQuery } from '@tanstack/react-query'
import { getMeetingAttendanceWithStewards } from '../api'

function useMeetingAttendanceQuery(meetingId: string | null) {
  return useQuery({
    queryKey: ['attendance', 'meeting', meetingId],
    queryFn: () => getMeetingAttendanceWithStewards(meetingId!),
    enabled: Boolean(meetingId),
  })
}

export default useMeetingAttendanceQuery
