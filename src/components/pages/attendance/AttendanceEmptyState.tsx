import { CalendarDays, Clock3, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Meeting } from '../../../features/meetings/types'

type AttendanceEmptyStateProps = {
  meetings?: Meeting[]
}

function AttendanceEmptyState({ meetings = [] }: AttendanceEmptyStateProps) {
  const recentMeetings = meetings.slice(0, 3)

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eef4ff] text-[#0f2d52]">
            <Clock3 className="h-7 w-7" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight text-[#0f2d52] sm:text-3xl">
            No Active Session
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
            To mark live attendance, an ongoing meeting session is required. 
            You can start a scheduled meeting from the meetings tab or view records of previous sessions below.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard/meetings"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f2d52] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-[#173c67]"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Go To Meetings</span>
            </Link>
          </div>
        </div>
      </div>

      {recentMeetings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-semibold text-[#0f2d52]">Recent Sessions</h3>
            <Link to="/dashboard/meetings" className="text-sm font-medium text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentMeetings.map((meeting) => (
              <Link 
                key={meeting.id}
                to={`/dashboard/attendance/${meeting.id}`}
                className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${meeting.statusTone}`}>
                    {meeting.status}
                  </span>
                  <Eye className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f2d52]">{meeting.title}</h4>
                  <p className="text-xs text-slate-500">{meeting.date}</p>
                </div>
                <div className="flex items-center gap-4 border-t border-slate-50 pt-3 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {meeting.present ?? 0} Present
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    {meeting.absent ?? 0} Absent
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default AttendanceEmptyState
