import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AttendanceEmptyState from '../components/pages/attendance/AttendanceEmptyState'
import AttendanceHero from '../components/pages/attendance/AttendanceHero'
import AttendanceRegistrySection from '../components/pages/attendance/AttendanceRegistrySection'
import AttendanceStatsSection from '../components/pages/attendance/AttendanceStatsSection'
import FinalizeSuccessPage from '../components/pages/attendance/FinalizeSuccessPage'
import RushModeBanner from '../components/pages/attendance/RushModeBanner'
import useFinalizeMeetingMutation from '../features/attendance/hooks/useFinalizeMeetingMutation'
import useMarkPresentMutation from '../features/attendance/hooks/useMarkPresentMutation'
import useMeetingAttendanceQuery from '../features/attendance/hooks/useMeetingAttendanceQuery'
import useMeetingsQuery from '../features/meetings/hooks/useMeetingsQuery'
import { useToast } from '../hooks/useToast'

const filters = ['All Stewards', 'Present Only', 'Absent Only', 'Pending']

function AttendancePage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeFilter, setActiveFilter] = useState('All Stewards')
  const [isRushMode, setIsRushMode] = useState(true)
  const [finalizedData, setFinalizedData] = useState<{
    total: number
    present: number
    absent: number
    performance: number
  } | null>(null)
  const [showLateOnly, setShowLateOnly] = useState(false)

  const meetingsQuery = useMeetingsQuery()
  const meetings = meetingsQuery.data ?? []
  
  const activeMeeting = meetingId 
    ? (meetings.find(m => m.id === meetingId) ?? null)
    : (meetings.find((m) => m.status === 'Ongoing') ?? null)

  const attendanceQuery = useMeetingAttendanceQuery(activeMeeting?.id ?? null)
  const markPresentMutation = useMarkPresentMutation()
  const finalizeMutation = useFinalizeMeetingMutation()

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

  const attendanceData = attendanceQuery.data
  const entries = attendanceData?.entries ?? []
  const statsData = attendanceData?.stats

  const cutoffDate = activeMeeting?.rawDate && activeMeeting?.rawCutoffTime
    ? new Date(`${activeMeeting.rawDate}T${activeMeeting.rawCutoffTime}`)
    : null
  const isCutoffPassed = cutoffDate ? new Date() > cutoffDate : false

  // Calculate throughput (check-ins per minute in the last 15 minutes)
  const recentCheckins = entries.filter(e => {
    if (e.status !== 'Present' || !e.markedAt) return false
    const markedTime = new Date(`${activeMeeting?.rawDate}T${e.markedAt}`)
    const diff = (new Date().getTime() - markedTime.getTime()) / (1000 * 60)
    return diff <= 15
  }).length
  const checkinSpeed = (recentCheckins / 15).toFixed(1)

  if ((finalizedData || activeMeeting?.status === 'Finalized') && activeMeeting) {
    const stats = finalizedData || {
      total: statsData?.total ?? 0,
      present: statsData?.present ?? 0,
      absent: statsData?.absent ?? 0,
      performance: parseInt(statsData?.rate ?? '0')
    }

    return (
      <FinalizeSuccessPage 
        meetingTitle={activeMeeting.title}
        stats={stats}
        onReturn={() => navigate('/dashboard')}
      />
    )
  }

  if (!activeMeeting) {
    return (
      <div className="space-y-8">
        <AttendanceEmptyState meetings={meetings} />
      </div>
    )
  }
  const filteredEntries = entries.filter((entry) => {
    if (showLateOnly) {
       if (entry.status !== 'Present' || !entry.markedAt || !cutoffDate) return false
       const markedTime = new Date(`${activeMeeting?.rawDate}T${entry.markedAt}`)
       return markedTime > cutoffDate
    }
    if (activeFilter === 'Present Only') return entry.status === 'Present'
    if (activeFilter === 'Absent Only') return entry.status === 'Absent'
    if (activeFilter === 'Pending') return entry.status === 'Unmarked'
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
      border: 'border-emerald-200 bg-emerald-50/20',
    },
    {
      label: 'Absent',
      value: String(statsData?.absent ?? 0),
      detail: 'Excused: 0',
      tone: 'text-rose-600',
      border: 'border-rose-100 bg-rose-50/20',
    },
    {
      label: 'Unmarked',
      value: String(statsData?.unmarked ?? 0),
      detail: 'Pending',
      tone: 'text-slate-400',
      border: 'border-slate-100 bg-slate-50/20',
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
    }
  }

  const handleFinalize = async () => {
    try {
      const result = await finalizeMutation.mutateAsync(activeMeeting.id)
      setFinalizedData(result.summary)
      showToast('Session finalized successfully', 'success')
    } catch (error) {
      showToast('Failed to finalize session', 'error')
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <AttendanceHero 
        meeting={activeMeeting} 
        onFinalize={handleFinalize}
        isFinalizing={finalizeMutation.isPending}
        isFinalized={activeMeeting.status === 'Finalized'}
      />
      
      <AttendanceStatsSection stats={stats} />
      
      <RushModeBanner 
        isActive={isRushMode}
        onToggle={() => setIsRushMode(prev => !prev)}
        expectedArrivals={statsData?.unmarked ?? 0}
        peakWindow="08:30 - 08:50 AM"
        checkinSpeed={Number(checkinSpeed)}
        onViewLateList={() => setShowLateOnly(prev => !prev)}
        isShowingLateOnly={showLateOnly}
      />

      <AttendanceRegistrySection
        entries={filteredEntries}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onMarkPresent={handleMarkPresent}
        markingUserId={markPresentMutation.isPending ? (markPresentMutation.variables?.userId ?? null) : null}
        isCutoffPassed={isCutoffPassed}
        isRushMode={isRushMode}
      />
    </div>
  )
}

export default AttendancePage
