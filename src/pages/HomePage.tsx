import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CirclePlus,
  ClipboardCheck,
  Clock,
  FileText,
  UserPlus,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HomeStatsSection from '../components/pages/home/HomeStatsSection'
import RecentMeetingsSection from '../components/pages/home/RecentMeetingsSection'
import RegistryActionsSection from '../components/pages/home/RegistryActionsSection'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ExcuseRequestModal from '../components/pages/attendance/ExcuseRequestModal'
import useAuth from '../hooks/useAuth'
import useMeetingsQuery from '../features/meetings/hooks/useMeetingsQuery'
import useStewardsQuery from '../features/stewards/hooks/useStewardsQuery'
import useMyAttendanceQuery from '../features/attendance/hooks/useMyAttendanceQuery'
import useMyExcusesQuery from '../features/attendance/hooks/useMyExcusesQuery'
import type { MyAttendanceRecord, MyExcuseRequest } from '../features/attendance/types'

const statusBadge = {
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-rose-100 text-rose-700',
  excused: 'bg-sky-100 text-sky-700',
  late: 'bg-amber-100 text-amber-700',
}

function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isSteward = user?.role?.toLowerCase() === 'steward'
  const [excuseModalMeeting, setExcuseModalMeeting] = useState<{ id: string; title: string } | null>(null)
  const stewardsQuery = useStewardsQuery('')
  const meetingsQuery = useMeetingsQuery()
  const myAttendanceQuery = useMyAttendanceQuery()
  const myExcusesQuery = useMyExcusesQuery()

  const allStewards = stewardsQuery.data?.items ?? []
  const stewards = allStewards.filter((s: { role: string }) => s.role.toLowerCase() !== 'admin')
  const meetings = meetingsQuery.data?.items ?? []

  const ongoingMeeting = meetings.find((m) => m.status === 'Ongoing')
  
  const completedMeetings = meetings.filter((m) => m.status === 'Completed')
  const totalCompleted = completedMeetings.length
  const avgRate = totalCompleted > 0 
    ? Math.round(completedMeetings.reduce((acc, m) => acc + (m.present ?? 0), 0) / (totalCompleted * (stewards.length || 1)) * 100)
    : 0

  let engagementTrend = undefined
  if (totalCompleted >= 2) {
    const lastMeeting = completedMeetings[0]
    const prevMeeting = completedMeetings[1]
    const lastRate = (lastMeeting.present ?? 0) / (stewards.length || 1)
    const prevRate = (prevMeeting.present ?? 0) / (stewards.length || 1)
    const diff = Math.round((lastRate - prevRate) * 100)
    
    if (diff !== 0) {
      engagementTrend = {
        value: Math.abs(diff),
        isUpward: diff > 0
      }
    }
  }

  const adminStats = [
    {
      label: 'Total Stewards',
      value: stewards.length.toString(),
      detail: 'Live count',
      tone: 'text-emerald-600' as const,
    },
    {
      label: 'Total Meetings',
      value: meetings.length.toString(),
      detail: 'Historical total',
      tone: 'text-slate-500' as const,
    },
    {
      label: "Active Session",
      value: ongoingMeeting ? '01' : '00',
      detail: ongoingMeeting ? 'In Progress' : 'No active meeting',
      tone: ongoingMeeting ? 'text-emerald-600' as const : 'text-slate-400' as const,
    },
    {
      label: 'Engagement Rate',
      value: `${avgRate}%`,
      detail: 'Average present',
      tone: 'text-slate-500' as const,
      trend: engagementTrend,
    },
  ]

  const myAttendance = (myAttendanceQuery.data ?? []) as MyAttendanceRecord[]
  const myPendingExcuses = ((myExcusesQuery.data ?? []) as { status: string }[]).filter(e => e.status === 'Pending')
  const myPresentCount = myAttendance.filter(a => a.status === 'present' || a.status === 'late').length
  const myTotalMarked = myAttendance.length
  const myRate = myTotalMarked > 0 ? Math.round((myPresentCount / myTotalMarked) * 100) : 0

  const stewardStats = [
    {
      label: 'My Attendance Rate',
      value: `${myRate}%`,
      detail: `${myPresentCount} of ${myTotalMarked} sessions`,
      tone: 'text-emerald-600' as const,
    },
    {
      label: 'Total Sessions',
      value: String(myTotalMarked),
      detail: 'Marked attendance',
      tone: 'text-slate-500' as const,
    },
    {
      label: "Pending Excuses",
      value: String(myPendingExcuses.length),
      detail: 'Awaiting review',
      tone: myPendingExcuses.length > 0 ? 'text-amber-600' as const : 'text-slate-400' as const,
    },
    {
      label: 'Upcoming Meetings',
      value: String(meetings.filter(m => m.status === 'Upcoming').length),
      detail: 'Scheduled sessions',
      tone: 'text-slate-500' as const,
    },
  ]

  const adminQuickActions = [
    {
      label: 'Mark Attendance',
      icon: ClipboardCheck,
      emphasized: true,
      onClick: () => navigate('/dashboard/attendance'),
    },
    {
      label: 'Add New Steward',
      icon: UserPlus,
      onClick: () => navigate('/dashboard/stewards'),
    },
    {
      label: 'Create Meeting',
      icon: CirclePlus,
      onClick: () => navigate('/dashboard/meetings'),
    },
  ]

  const stewardQuickActions = [
    {
      label: 'View My Attendance',
      icon: ClipboardCheck,
      emphasized: true,
      onClick: () => navigate('/dashboard/attendance'),
    },
    {
      label: 'My Excuses',
      icon: FileText,
      onClick: () => navigate('/dashboard/my-excuses'),
    },
  ]

  const recentMeetings = [...meetings]
    .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
    .slice(0, 5)

  const recentMyAttendance = [...myAttendance].slice(0, 5)

  const upcomingMeetings = meetings.filter(m => m.status === 'Upcoming')
  const excusesByMeetingId = new Map<number, MyExcuseRequest>()
  ;(myExcusesQuery.data ?? []).forEach((e: MyExcuseRequest) => {
    excusesByMeetingId.set(e.meetingId, e)
  })

  const excuseStatusConfig = {
    Pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    Approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved' },
    Rejected: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Not Approved' },
  } as const

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={isSteward ? `Welcome, ${user?.name ?? 'Steward'}` : 'Overview'}
        description={
          isSteward
            ? 'Your attendance summary over the last 6 months.'
            : `Monitoring registry activity for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}.`
        }
      />

      <HomeStatsSection 
        stats={isSteward ? stewardStats : adminStats} 
        isLoading={isSteward ? (myAttendanceQuery.isLoading || myExcusesQuery.isLoading) : (stewardsQuery.isLoading || meetingsQuery.isLoading)}
      />

      {isSteward ? (
        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0f2d52]">Recent Sessions</h3>
              {myAttendance.length > 5 && (
                <button onClick={() => navigate('/dashboard/attendance')} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#0f2d52] transition">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            {recentMyAttendance.length === 0 ? (
              <p className="py-8 text-center text-sm font-medium text-slate-400">No attendance records yet.</p>
            ) : (
              <div className="space-y-2">
                {recentMyAttendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between rounded-2xl bg-slate-50/70 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#0f2d52] truncate">
                        {record.meeting.title || `${record.meeting.type} Meeting`}
                      </p>
                      <p className="text-xs font-medium text-slate-400">
                        {record.meeting.date.split('T')[0]} &middot; {record.meeting.startTime}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${statusBadge[record.status as keyof typeof statusBadge] ?? 'bg-slate-100 text-slate-600'}`}>
                      {record.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0f2d52]" />
                <h3 className="text-sm font-bold text-[#0f2d52]">Upcoming Meetings</h3>
              </div>
              {upcomingMeetings.length === 0 ? (
                <p className="py-6 text-center text-sm font-medium text-slate-400">No upcoming meetings scheduled.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting) => {
                    const excuse = excusesByMeetingId.get(Number(meeting.id))
                    const config = excuse ? excuseStatusConfig[excuse.status as keyof typeof excuseStatusConfig] : null
                    return (
                      <div key={meeting.id} className="rounded-2xl bg-slate-50/70 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#0f2d52] truncate">
                              {meeting.title || `${meeting.type} Meeting`}
                            </p>
                            <p className="text-xs font-medium text-slate-400">
                               {meeting.rawDate.split('T')[0]} &middot; {meeting.rawStartTime}
                            </p>
                          </div>
                          {config ? (
                            <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${config.bg} ${config.text}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${config.bg.replace('-100', '-500')} ${excuse?.status === 'Pending' ? 'animate-pulse' : ''}`} />
                              {config.label}
                            </span>
                          ) : (
                            <button
                              onClick={() => setExcuseModalMeeting({ id: meeting.id, title: meeting.title || `${meeting.type} Meeting` })}
                              className="shrink-0 rounded-xl bg-[#0f2d52] px-4 py-2 text-[10px] font-bold text-white shadow-sm hover:bg-[#173c67] transition active:scale-95"
                            >
                              Request Excuse
                            </button>
                          )}
                        </div>
                        {excuse?.status === 'Rejected' && (
                          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2">
                            <AlertTriangle className="h-3 w-3 text-rose-500 shrink-0" />
                            <p className="text-[10px] font-bold text-rose-700">This excuse was not approved — you need to attend this meeting.</p>
                          </div>
                        )}
                        {excuse?.status === 'Pending' && (
                          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2">
                            <Clock className="h-3 w-3 text-amber-500 shrink-0" />
                            <p className="text-[10px] font-bold text-amber-700">Awaiting review by your department leader.</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <RegistryActionsSection actions={stewardQuickActions} />
          </div>
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <RecentMeetingsSection 
            meetings={recentMeetings} 
            isLoading={meetingsQuery.isLoading}
            onViewAll={() => navigate('/dashboard/meetings')}
          />
          <RegistryActionsSection actions={adminQuickActions} />
        </section>
      )}

      <ExcuseRequestModal
        isOpen={excuseModalMeeting !== null}
        onClose={() => setExcuseModalMeeting(null)}
        meetingId={excuseModalMeeting?.id ?? ''}
        meetingTitle={excuseModalMeeting?.title ?? ''}
      />
    </div>
  )
}

export default HomePage
