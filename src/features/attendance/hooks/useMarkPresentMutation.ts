import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markPresent } from '../api'
import type { MeetingAttendanceData, MeetingAttendanceEntry } from '../types'

function useMarkPresentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, meetingId, status }: { userId: string; meetingId: string; status?: string }) =>
      markPresent(userId, meetingId, status),
    onMutate: async ({ userId, meetingId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['attendance', 'meeting', meetingId] })

      const previous = queryClient.getQueryData<MeetingAttendanceData>(['attendance', 'meeting', meetingId])

      if (previous) {
        const newStatus: MeetingAttendanceEntry['status'] =
          status === 'present' || status === 'late' ? 'Present'
          : status === 'excused' ? 'Excused'
          : 'Absent'

        const updatedEntries = previous.entries.map((entry) =>
          String(entry.steward.id) === String(userId)
            ? { ...entry, status: newStatus, markedAt: 'Just now' }
            : entry
        )

        const total = updatedEntries.length
        const present = updatedEntries.filter((e) => e.status === 'Present').length
        const absent = updatedEntries.filter((e) => e.status === 'Absent').length
        const excused = updatedEntries.filter((e) => e.status === 'Excused').length
        const unmarked = updatedEntries.filter((e) => e.status === 'Unmarked').length

        queryClient.setQueryData<MeetingAttendanceData>(['attendance', 'meeting', meetingId], {
          entries: updatedEntries,
          stats: {
            total,
            present,
            absent,
            excused,
            unmarked,
            rate: total > 0 ? `${Math.round((present / total) * 100)}%` : '0%',
          },
        })
      }

      return { previous }
    },
    onError: (_err, { meetingId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['attendance', 'meeting', meetingId], context.previous)
      }
    },
    onSettled: (_data, _error, { meetingId }) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', 'meeting', meetingId] })
    },
  })
}

export default useMarkPresentMutation
