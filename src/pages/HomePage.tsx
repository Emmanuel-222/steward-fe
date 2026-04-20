import {
  CirclePlus,
  ClipboardCheck,
  UserPlus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import HomeStatsSection from '../components/pages/home/HomeStatsSection'
import RecentMeetingsSection from '../components/pages/home/RecentMeetingsSection'
import RegistryActionsSection from '../components/pages/home/RegistryActionsSection'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import FloatingActionButton from '../components/shared/FloatingActionButton'
import useMeetingsQuery from '../features/meetings/hooks/useMeetingsQuery'
import useStewardsQuery from '../features/stewards/hooks/useStewardsQuery'

function HomePage() {
  const navigate = useNavigate()
  const stewardsQuery = useStewardsQuery('')
  const meetingsQuery = useMeetingsQuery()

  const stewards = stewardsQuery.data ?? []
  const meetings = meetingsQuery.data ?? []

  const ongoingMeeting = meetings.find((m) => m.status === 'Ongoing')
  
  // Basic rate calculation: average of present rate across all completed meetings
  const completedMeetings = meetings.filter((m) => m.status === 'Completed')
  const totalCompleted = completedMeetings.length
  const avgRate = totalCompleted > 0 
    ? Math.round(completedMeetings.reduce((acc, m) => acc + (m.present ?? 0), 0) / (totalCompleted * (stewards.length || 1)) * 100)
    : 0

  const stats = [
    {
      label: 'Total Stewards',
      value: stewards.length.toString(),
      detail: 'Live count',
      tone: 'text-emerald-600',
    },
    {
      label: 'Total Meetings',
      value: meetings.length.toString(),
      detail: 'Historical total',
      tone: 'text-slate-500',
    },
    {
      label: "Active Session",
      value: ongoingMeeting ? '01' : '00',
      detail: ongoingMeeting ? 'In Progress' : 'No active meeting',
      tone: ongoingMeeting ? 'text-emerald-600' : 'text-slate-400',
    },
    {
      label: 'Engagement Rate',
      value: `${avgRate}%`,
      detail: 'Average present',
      tone: 'text-slate-500',
    },
  ]

  const quickActions = [
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

  const recentMeetings = [...meetings]
    .sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Overview"
        description={`Monitoring registry activity for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}.`}
      />

      <HomeStatsSection 
        stats={stats} 
        isLoading={stewardsQuery.isLoading || meetingsQuery.isLoading} 
      />

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <RecentMeetingsSection 
          meetings={recentMeetings} 
          isLoading={meetingsQuery.isLoading}
          onViewAll={() => navigate('/dashboard/meetings')}
        />
        <RegistryActionsSection actions={quickActions} />
      </section>

      <FloatingActionButton 
        icon={CirclePlus} 
        label="Quick action" 
        onClick={() => navigate('/dashboard/meetings')}
      />
    </div>
  )
}

export default HomePage
