import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AttendanceEmptyState from '../components/pages/attendance/AttendanceEmptyState'
import AttendanceHero from '../components/pages/attendance/AttendanceHero'
import AttendanceInsightBanner from '../components/pages/attendance/AttendanceInsightBanner'
import AttendanceRegistrySection from '../components/pages/attendance/AttendanceRegistrySection'
import AttendanceStatsSection from '../components/pages/attendance/AttendanceStatsSection'
import useMarkPresentMutation from '../features/attendance/hooks/useMarkPresentMutation'
import useMeetingAttendanceQuery from '../features/attendance/hooks/useMeetingAttendanceQuery'
import useMeetingsQuery from '../features/meetings/hooks/useMeetingsQuery'
import { useToast } from '../hooks/useToast'

const filters = ['All Stewards', 'Present Only', 'Absent Only', 'Unmarked Only']

function AttendancePage() {
  const { meetingId } = useParams()
  const { showToast } = useToast()
  const [activeFilter, setActiveFilter] = useState('All Stewards')
  const meetingsQuery = useMeetingsQuery()
  const meetings = meetingsQuery.data ?? []
  
  // Find the meeting to track attendance for
  const activeMeeting = meetingId 
    ? (meetings.find(m => m.id === meetingId) ?? null)
    : (meetings.find((m) => m.status === 'Ongoing') ?? null)

  const attendanceQuery = useMeetingAttendanceQuery(activeMeeting?.id ?? null)
  const markPresentMutation = useMarkPresentMutation()

  if (meetingsQuery.isLoading || (activeMeeting && attendanceQuery.isLoading)) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        Checking active meeting...
      </div>
    )
  }

  if (meetingsQuery.isError || attendanceQuery.isError) {
    return (
      <div className="rounded-[30px] border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-600 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        Unable to load attendance right now.
      </div>
    )
  }

  if (!activeMeeting) {
    return (
      <div className="space-y-8">
        <AttendanceEmptyState meetings={meetings} />
      </div>
    )
  }

  const attendanceData = attendanceQuery.data
  const entries = attendanceData?.entries ?? []
  const statsData = attendanceData?.stats

  const cutoffDate = activeMeeting?.rawDate && activeMeeting?.rawCutoffTime
    ? new Date(`${activeMeeting.rawDate}T${activeMeeting.rawCutoffTime}`)
    : null
  const isCutoffPassed = cutoffDate ? new Date() > cutoffDate : false

  const filteredEntries = entries.filter((entry) => {
    if (activeFilter === 'Present Only') return entry.status === 'Present'
    if (activeFilter === 'Absent Only') return entry.status === 'Absent'
    if (activeFilter === 'Unmarked Only') return entry.status === 'Unmarked'
    return true
  })

  const stats = [
    {
      label: 'Total Stewards',
      value: String(statsData?.total ?? 0),
      detail: 'Assigned',
      tone: 'text-slate-500',
      border: 'border-slate-100',
    },
    {
      label: 'Present',
      value: String(statsData?.present ?? 0),
      detail: `${statsData?.rate ?? '0%'} reached`,
      tone: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: 'Absent',
      value: String(statsData?.absent ?? 0),
      detail: 'Auto-marked',
      tone: 'text-rose-600',
      border: 'border-rose-100',
    },
    {
      label: 'Unmarked',
      value: String(statsData?.unmarked ?? 0),
      detail: 'Pending',
      tone: 'text-slate-400',
      border: 'border-slate-100',
    },
    {
      label: 'Attendance Rate',
      value: statsData?.rate ?? '0%',
      detail: 'Live update',
      tone: 'text-blue-600',
      border: 'border-blue-100',
    },
  ]

  const handleMarkPresent = async (userId: string) => {
    try {
      await markPresentMutation.mutateAsync({
        userId,
        meetingId: activeMeeting.id,
      })
      showToast('Steward marked as present', 'success')
    } catch (error) {
      showToast('Failed to mark attendance', 'error')
      console.error('Failed to mark attendance:', error)
    }
  }

  return (
    <div className="space-y-8">
      <AttendanceHero meeting={activeMeeting} />
      
      <AttendanceStatsSection stats={stats} />
      
      <AttendanceRegistrySection
        entries={filteredEntries}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onMarkPresent={handleMarkPresent}
        markingUserId={markPresentMutation.isPending ? (markPresentMutation.variables?.userId ?? null) : null}
        isCutoffPassed={isCutoffPassed}
      />
      
      <AttendanceInsightBanner 
        presentCount={statsData?.present ?? 0}
        unmarkedCount={statsData?.unmarked ?? 0}
      />
    </div>
  )
}

export default AttendancePage
