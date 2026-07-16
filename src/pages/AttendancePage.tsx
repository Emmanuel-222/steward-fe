import { CalendarDays as CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AttendanceEmptyState from '../components/pages/attendance/AttendanceEmptyState'
import AttendanceHero from '../components/pages/attendance/AttendanceHero'
import AttendanceRegistrySection from '../components/pages/attendance/AttendanceRegistrySection'
import AttendanceStatsSection from '../components/pages/attendance/AttendanceStatsSection'
import FinalizeSuccessPage, { type FinalizeSuccessPageProps } from '../components/pages/attendance/FinalizeSuccessPage'
import RushModeBanner from '../components/pages/attendance/RushModeBanner'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import useFinalizeMeetingMutation from '../features/attendance/hooks/useFinalizeMeetingMutation'
import useMarkPresentMutation from '../features/attendance/hooks/useMarkPresentMutation'
import useMeetingAttendanceQuery from '../features/attendance/hooks/useMeetingAttendanceQuery'
import useMeetingsQuery from '../features/meetings/hooks/useMeetingsQuery'
import { useToast } from '../hooks/useToast'
import useAuth from '../hooks/useAuth'
import useMeQuery from '../features/auth/hooks/useMeQuery'
import ExcuseRequestModal from '../components/pages/attendance/ExcuseRequestModal'
import PendingExcusesBanner from '../components/pages/attendance/PendingExcusesBanner'

const filters = ['All Stewards', 'Present Only', 'Absent Only', 'Excused Only', 'Pending']

function AttendancePage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeFilter, setActiveFilter] = useState('All Stewards')
  const [isRushMode] = useState(true)
  const [justMarkedUserId, setJustMarkedUserId] = useState<string | null>(null)
  const [finalizedData, setFinalizedData] = useState<{
    total: number
    present: number
    absent: number
    excused: number
    performance: number
  } | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [showLateOnly, setShowLateOnly] = useState(false)
  const [isExcuseModalOpen, setIsExcuseModalOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const meQuery = useMeQuery(!user && isAuthenticated)
  const currentUser = user || meQuery.data
  const isAdminOrLeader = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'leader' || currentUser?.role?.toLowerCase() === 'pastor'
  const canMarkAttendance = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'pastor'

  const meetingsQuery = useMeetingsQuery()
  const meetings = meetingsQuery.data?.items ?? []
  
  const activeMeeting = meetingId 
    ? (meetings.find(m => m.id === meetingId) ?? null)
    : (meetings.find((m) => m.status === 'Ongoing') ?? null)

  const attendanceQuery = useMeetingAttendanceQuery(activeMeeting?.id ?? null)
  const markPresentMutation = useMarkPresentMutation()
  const finalizeMutation = useFinalizeMeetingMutation()

  if (meetingsQuery.isLoading || (activeMeeting && attendanceQuery.isLoading) || (isAuthenticated && !currentUser)) {
    return (
      <div className="animate-pulse space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-card" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-[20px]" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-card" />
      </div>
    )
  }

  if (meetingsQuery.isError || attendanceQuery.isError) {
    return (
      <ErrorState
        message="Unable to load attendance right now."
        onRetry={() => {
          meetingsQuery.refetch()
          if (activeMeeting) attendanceQuery.refetch()
        }}
      />
    )
  }

  const attendanceData = attendanceQuery.data
  const entries = attendanceData?.entries ?? []
  const statsData = attendanceData?.stats

  const parseTime = (timeStr: string | undefined, dateStr: string | undefined) => {
    if (!timeStr || !dateStr) return null
    const [time, modifier] = timeStr.split(' ')
    const [strHours, strMinutes] = time.split(':')
    let hours = Number(strHours)
    const minutes = Number(strMinutes)
    if (modifier === 'PM' && hours < 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0
    
    const date = new Date(dateStr)
    date.setHours(hours, minutes, 0, 0)
    return date
  }

  const cutoffDate = parseTime(activeMeeting?.rawCutoffTime, activeMeeting?.rawDate)

  // Calculate throughput (check-ins per minute in the last 15 minutes)
  const recentCheckins = entries.filter(e => {
    if (e.status !== 'Present' || !e.markedAt) return false
    const markedTime = parseTime(e.markedAt, activeMeeting?.rawDate)
    if (!markedTime) return false
    const diff = (new Date().getTime() - markedTime.getTime()) / (1000 * 60)
    return diff <= 15
  }).length
  const checkinSpeed = (recentCheckins / 15).toFixed(1)

  if (isAdminOrLeader && (finalizedData || activeMeeting?.status === 'Finalized' || activeMeeting?.status === 'Completed') && activeMeeting && !showReport) {
    const stats: FinalizeSuccessPageProps['stats'] = finalizedData ?? {
      total: statsData?.total ?? 0,
      present: statsData?.present ?? 0,
      absent: statsData?.absent ?? 0,
      excused: statsData?.excused ?? 0,
      performance: parseInt(statsData?.rate ?? '0')
    }

    return (
      <FinalizeSuccessPage 
        meetingTitle={activeMeeting.title}
        stats={stats}
        onReturn={() => navigate('/dashboard')}
        onViewReport={() => setShowReport(true)}
      />
    )
  }

  if (activeMeeting?.status === 'Upcoming') {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-card border border-slate-200 bg-white px-6 py-24 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-500 shadow-sm border border-sky-100/50">
          <CalendarIcon className="h-10 w-10" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-2xl font-bold tracking-tight text-brand">
            {activeMeeting.title} is scheduled
          </h3>
          <p className="text-slate-500 font-medium">
            This session is set for <span className="text-brand font-bold">{activeMeeting.date}</span> at <span className="text-brand font-bold">{activeMeeting.time}</span>. 
            Attendance marking will be enabled once the session starts.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/meetings')}
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-[0_15px_40px_rgba(15,45,82,0.2)] transition hover:bg-brand-hover"
        >
          Return to Schedule
        </button>
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
  const filteredEntries = entries.filter((entry) => {
    if (showLateOnly) {
       if (entry.status !== 'Present' || !entry.markedAt || !cutoffDate) return false
       const markedTime = parseTime(entry.markedAt, activeMeeting?.rawDate)
       return markedTime ? markedTime > cutoffDate : false
    }
    if (activeFilter === 'Present Only') return entry.status === 'Present'
    if (activeFilter === 'Absent Only') return entry.status === 'Absent'
    if (activeFilter === 'Excused Only') return entry.status === 'Excused'
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
      detail: 'Marked Absent',
      tone: 'text-rose-600',
      border: 'border-rose-100 bg-rose-50/20',
    },
    {
      label: 'Excused',
      value: String(statsData?.excused ?? 0),
      detail: 'Exempted',
      tone: 'text-sky-600',
      border: 'border-sky-100 bg-sky-50/20',
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
        status: 'present',
      })
      setJustMarkedUserId(userId)
      setTimeout(() => setJustMarkedUserId(null), 800)
      showToast('Steward marked as present', 'success')
    } catch {
      showToast('Failed to mark attendance', 'error')
    }
  }

  const handleMarkAbsent = async (userId: string) => {
    try {
      await markPresentMutation.mutateAsync({
        userId,
        meetingId: activeMeeting.id,
        status: 'absent',
      })
      setJustMarkedUserId(userId)
      setTimeout(() => setJustMarkedUserId(null), 800)
      showToast('Steward marked as absent', 'success')
    } catch {
      showToast('Failed to mark attendance', 'error')
    }
  }

  const handleFinalize = async () => {
    try {
      const result = await finalizeMutation.mutateAsync(activeMeeting.id)
      setFinalizedData(result.summary)
      showToast('Session finalized successfully', 'success')
    } catch {
      showToast('Failed to finalize session', 'error')
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <AttendanceHero 
        meeting={activeMeeting} 
        onFinalize={handleFinalize}
        isFinalizing={finalizeMutation.isPending}
        isFinalized={activeMeeting.status === 'Finalized' || activeMeeting.status === 'Completed'}
      />

      {isAdminOrLeader && <PendingExcusesBanner />}
      
      {isAdminOrLeader ? (
        <>
          <AttendanceStatsSection stats={stats} />
          
          <RushModeBanner 
            isActive={isRushMode}
            expectedArrivals={statsData?.unmarked ?? 0}
            peakWindow={`${activeMeeting.rawStartTime} - ${activeMeeting.rawCutoffTime}`}
            checkinSpeed={Number(checkinSpeed)}
            onViewLateList={() => setShowLateOnly(prev => !prev)}
            isShowingLateOnly={showLateOnly}
            meetingTitle={activeMeeting.title}
          />

          {showReport && (
            <div className="mb-6 flex items-center justify-between rounded-3xl bg-brand p-6 text-white shadow-xl shadow-slate-200/50">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">Detailed Session Report</h2>
                <p className="text-xs font-medium text-slate-300">Viewing finalized attendance for {activeMeeting.title}</p>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className="rounded-2xl bg-white/10 px-6 py-3 text-xs font-bold transition hover:bg-white/20"
              >
                Back to Summary
              </button>
            </div>
          )}

          <AttendanceRegistrySection
            entries={filteredEntries}
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onMarkPresent={handleMarkPresent}
            onMarkAbsent={handleMarkAbsent}
            markingUserId={markPresentMutation.isPending ? (markPresentMutation.variables?.userId ?? null) : null}
            cutoffDate={cutoffDate}
            isRushMode={isRushMode}
            meetingTitle={activeMeeting.title}
            isReadOnly={showReport || activeMeeting.status === 'Finalized' || activeMeeting.status === 'Completed' || !canMarkAttendance}
            meetingIsFinalized={showReport || activeMeeting.status === 'Finalized' || activeMeeting.status === 'Completed'}
            justMarkedUserId={justMarkedUserId}
          />
        </>
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-card border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand text-2xl font-bold text-white shadow-xl shadow-[#0f2d52]/20">
                {currentUser?.initials || currentUser?.name?.[0] || 'S'}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-brand">{currentUser?.name}</h3>
                <p className="text-sm font-medium text-slate-400">{currentUser?.role || 'Steward'}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Status</p>
                <div className="mt-2 flex items-center gap-2">
                  {(() => {
                    const myEntry = entries.find(e => String(e.steward.id) === String(currentUser?.id))
                    if (!myEntry) return <span className="text-lg font-bold text-slate-400">Not Registered</span>
                    
                    if (myEntry.status === 'Present') return (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        PRESENT
                      </span>
                    )
                    if (myEntry.status === 'Excused') return (
                      <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold text-sky-700">
                        EXCUSED
                      </span>
                    )
                    if (myEntry.status === 'Absent') return (
                      <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold text-rose-700">
                        ABSENT
                      </span>
                    )
                    return (
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-600">
                        PENDING
                      </span>
                    )
                  })()}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Session Date</p>
                <p className="mt-2 text-lg font-bold text-brand">{activeMeeting.date}</p>
              </div>
            </div>

            {(() => {
              const myEntry = entries.find(e => String(e.steward.id) === String(currentUser?.id))
              if (myEntry?.status === 'Unmarked') {
                if (activeMeeting.status === 'Ongoing') {
                  return (
                    <div className="mt-8 rounded-3xl border border-indigo-100 bg-indigo-50/50 p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-indigo-900">Unable to attend?</p>
                          <p className="text-xs font-medium text-indigo-600">Submit an excuse request for this session.</p>
                        </div>
                        <button 
                          onClick={() => setIsExcuseModalOpen(true)}
                          className="rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition active:scale-95"
                        >
                          Request Excuse
                        </button>
                      </div>
                    </div>
                  )
                }
                
                return (
                  <div className="mt-8 rounded-3xl border border-rose-100 bg-rose-50/50 p-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">Final Outcome</p>
                    <p className="mt-2 text-sm font-medium text-rose-800">
                      This session has concluded. You were marked as <span className="font-bold">Absent</span>.
                    </p>
                  </div>
                )
              }
              if (myEntry?.status === 'Excused' && myEntry.excuseReason) {
                return (
                  <div className="mt-8 rounded-3xl border border-sky-100 bg-sky-50/50 p-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-sky-600">Your Excuse Reason</p>
                    <p className="mt-2 text-sm font-medium text-sky-800 italic">"{myEntry.excuseReason}"</p>
                  </div>
                )
              }
              return null
            })()}
          </div>

          <div className="rounded-card border border-slate-100 bg-slate-50/30 p-6 text-center">
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                End of personal session view
             </p>
          </div>
        </div>
      )}

      <ExcuseRequestModal 
        isOpen={isExcuseModalOpen}
        onClose={() => setIsExcuseModalOpen(false)}
        meetingId={activeMeeting.id}
        meetingTitle={activeMeeting.title}
      />
    </div>
  )
}

export default AttendancePage


