import { CalendarDays } from 'lucide-react'
import type { Meeting } from '../../../features/meetings/types'

type RecentMeetingsSectionProps = {
  meetings: Meeting[]
  isLoading?: boolean
  onViewAll?: () => void
}

function RecentMeetingsSection({ 
  meetings, 
  isLoading,
  onViewAll 
}: RecentMeetingsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold text-[#0f2d52]">Recent Meetings</h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-left text-sm font-medium text-slate-500 transition hover:text-slate-700 sm:text-right"
        >
          View All Records
        </button>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        {isLoading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Loading recent sessions...
          </div>
        ) : meetings.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            No recent meetings found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {meetings.map((meeting) => (
              <article
                key={meeting.id}
                className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eff4fb] text-[#0f2d52]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{meeting.title}</h4>
                    <p className="text-sm text-slate-500">{meeting.date} · {meeting.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:justify-end lg:gap-8">
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold text-emerald-600">
                      {meeting.present ?? 0}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Present
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-lg font-semibold text-rose-500">
                      {meeting.absent ?? 0}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Absent
                    </p>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meeting.statusTone}`}>
                    {meeting.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentMeetingsSection
