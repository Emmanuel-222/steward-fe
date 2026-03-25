import {
  CalendarDays,
  CirclePlus,
  ClipboardCheck,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import FloatingActionButton from '../components/shared/FloatingActionButton'
import HomeStatsSection from '../components/pages/home/HomeStatsSection'
import RecentMeetingsSection from '../components/pages/home/RecentMeetingsSection'
import RegistryActionsSection from '../components/pages/home/RegistryActionsSection'

const stats = [
  {
    label: 'Total Stewards',
    value: '1,248',
    detail: '+12%',
    tone: 'text-emerald-600',
  },
  {
    label: 'Total Meetings',
    value: '84',
    detail: '8 scheduled this week',
    tone: 'text-slate-500',
  },
  {
    label: "Today's Meeting",
    value: '02',
    detail: 'In Progress',
    tone: 'text-emerald-600',
  },
  {
    label: 'Attendance Rate',
    value: '94.2%',
    detail: 'Consistent since Sept',
    tone: 'text-slate-500',
  },
]

const recentMeetings = [
  {
    title: 'Monthly General Assembly',
    meta: '22nd Oct 2023 · Auditorium A',
    present: 312,
    absent: 12,
    status: 'Completed',
    icon: CalendarDays,
  },
  {
    title: 'Steward Onboarding Session',
    meta: '20th Oct 2023 · Zoom Meeting',
    present: 45,
    absent: 3,
    status: 'Completed',
    icon: Users,
  },
  {
    title: 'Regional Coordinators Sync',
    meta: '18th Oct 2023 · Conference Room 2',
    present: 28,
    absent: 0,
    status: 'Full Attendance',
    icon: Users,
  },
  {
    title: 'Safety Protocol Briefing',
    meta: '15th Oct 2023 · Main Hall',
    present: 198,
    absent: 22,
    status: 'Completed',
    icon: ShieldCheck,
  },
  {
    title: 'Drafting Committee Meet',
    meta: '12th Oct 2023 · Office 12',
    present: 15,
    absent: 1,
    status: 'Completed',
    icon: ClipboardCheck,
  },
]

const quickActions = [
  {
    label: 'Mark Attendance',
    icon: ClipboardCheck,
    emphasized: true,
  },
  {
    label: 'Add New Steward',
    icon: UserPlus,
  },
  {
    label: 'Create Meeting',
    icon: CirclePlus,
  },
]

function HomePage() {
  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Overview"
        description="Monitoring registry activity for Monday, Oct 23rd."
      />

      <HomeStatsSection stats={stats} />

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <RecentMeetingsSection meetings={recentMeetings} />
        <RegistryActionsSection actions={quickActions} />
      </section>

      <FloatingActionButton icon={CirclePlus} label="Quick action" />
    </div>
  )
}

export default HomePage
