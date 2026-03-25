import { CalendarDays, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import MeetingCard from '../components/pages/meetings/MeetingCard'
import MeetingScheduleCard from '../components/pages/meetings/MeetingScheduleCard'
import MeetingsTabs from '../components/pages/meetings/MeetingsTabs'
import ScheduleMeetingModal from '../components/pages/meetings/ScheduleMeetingModal'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import FloatingActionButton from '../components/shared/FloatingActionButton'

const tabs = ['All Meetings', 'Upcoming', 'Completed', 'Archived']

const meetings = [
  {
    status: 'Active',
    statusTone: 'bg-emerald-100 text-emerald-700',
    title: 'Sunday Morning Service',
    subtitle: 'Central Assembly Ledger',
    date: 'Oct 27, 2024',
    time: '08:00 AM - 11:30 AM',
    location: 'Custodial, 050 AM',
    present: 142,
    absent: 12,
    primaryAction: 'View Attendance',
    secondaryAction: 'Edit',
  },
  {
    status: 'Completed',
    statusTone: 'bg-rose-100 text-rose-700',
    title: 'Mid-Week Vigil',
    subtitle: 'Spirit & Development',
    date: 'Oct 23, 2024',
    time: '11:00 PM - 02:00 AM',
    location: 'Custodial, 11:45 PM',
    present: 85,
    absent: 69,
    primaryAction: 'Review Report',
    secondaryAction: 'Logs',
  },
  {
    status: 'Upcoming',
    statusTone: 'bg-sky-100 text-sky-700',
    title: 'Monthly Steward Meeting',
    subtitle: 'Administrative Briefing',
    date: 'Nov 03, 2024',
    time: '04:00 PM - 06:00 PM',
    location: 'Custodial, 01:15 PM',
    present: null,
    absent: null,
    primaryAction: 'Prepare Check-in',
    secondaryAction: 'Edit Details',
  },
  {
    status: 'Completed',
    statusTone: 'bg-rose-100 text-rose-700',
    title: 'Choir Rehearsal',
    subtitle: 'Arts & Music Dept.',
    date: 'Oct 17, 2024',
    time: '05:30 PM - 08:45 PM',
    location: 'Custodial, 07:00 PM',
    present: 32,
    absent: 4,
    primaryAction: 'View Attendance',
    secondaryAction: 'Edit',
  },
]

function MeetingsPage() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  useEffect(() => {
    if (!isScheduleModalOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsScheduleModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isScheduleModalOpen])

  return (
    <>
      <div className="space-y-8">
        <DashboardPageHeader
          eyebrow="Overview"
          title="Manage Ledger Sessions"
          actions={
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f2d52] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-[#173c67]"
            >
              <Plus className="h-4 w-4" />
              Create Meeting
            </button>
          }
        />

        <section className="space-y-4">
          <MeetingsTabs tabs={tabs} />

          <div className="grid gap-5 xl:grid-cols-3">
            {meetings.slice(0, 3).map((meeting) => (
              <MeetingCard key={meeting.title} meeting={meeting} />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <MeetingCard meeting={meetings[3]} />
            <MeetingScheduleCard onClick={() => setIsScheduleModalOpen(true)} />
          </div>
        </section>

        <FloatingActionButton
          icon={CalendarDays}
          label="Schedule meeting"
          onClick={() => setIsScheduleModalOpen(true)}
        />
      </div>

      <ScheduleMeetingModal
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </>
  )
}

export default MeetingsPage
