import { Check, TimerReset, X } from 'lucide-react'
import AttendanceHero from '../components/pages/attendance/AttendanceHero'
import AttendanceInsightBanner from '../components/pages/attendance/AttendanceInsightBanner'
import AttendanceRegistrySection from '../components/pages/attendance/AttendanceRegistrySection'
import AttendanceStatsSection from '../components/pages/attendance/AttendanceStatsSection'

const stats = [
  {
    label: 'Total Stewards',
    value: '124',
    detail: 'Assigned',
    tone: 'text-slate-500',
    border: 'border-slate-100',
  },
  {
    label: 'Present',
    value: '86',
    detail: '69% reached',
    tone: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  {
    label: 'Absent',
    value: '12',
    detail: 'Excused 4',
    tone: 'text-rose-600',
    border: 'border-rose-100',
  },
  {
    label: 'Unmarked',
    value: '26',
    detail: 'Pending',
    tone: 'text-slate-400',
    border: 'border-slate-100',
  },
]

const filters = ['All Stewards', 'Present Only', 'Absent Only', 'Pending (26)']

const attendanceRows = [
  {
    name: 'Abraham Lincoln',
    email: 'abraham@registry.org',
    role: 'Floor Lead',
    status: 'Unmarked',
    statusTone: 'bg-slate-100 text-slate-600',
    actionLabel: 'Mark Present',
    actionTone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accent: 'border-transparent',
    secondaryIcon: X,
  },
  {
    name: 'Elizabeth Swan',
    email: 'e.swan@registry.org',
    role: 'Usher',
    status: 'Present',
    statusTone: 'bg-emerald-100 text-emerald-700',
    actionLabel: 'Checked in at 08:12 AM',
    actionTone: 'bg-transparent text-slate-400 border-transparent',
    accent: 'border-emerald-300',
    secondaryIcon: TimerReset,
  },
  {
    name: 'Charles Darwin',
    email: 'c.darwin@registry.org',
    role: 'Security',
    status: 'Absent',
    statusTone: 'bg-rose-100 text-rose-700',
    actionLabel: 'View Excuse',
    actionTone: 'bg-slate-50 text-slate-600 border-slate-200',
    accent: 'border-rose-300',
    secondaryIcon: Check,
  },
  {
    name: 'Grace Hopper',
    email: 'grace.h@registry.org',
    role: 'Sanctuary Support',
    status: 'Unmarked',
    statusTone: 'bg-slate-100 text-slate-600',
    actionLabel: 'Quick Tip',
    actionTone: 'bg-transparent text-slate-400 border-transparent',
    accent: 'border-transparent',
    secondaryIcon: null,
  },
]

function AttendancePage() {
  return (
    <div className="space-y-8">
      <AttendanceHero />
      <AttendanceStatsSection stats={stats} />
      <AttendanceRegistrySection filters={filters} rows={attendanceRows} />
      <AttendanceInsightBanner />
    </div>
  )
}

export default AttendancePage
