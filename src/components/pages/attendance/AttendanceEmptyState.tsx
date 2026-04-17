import { CalendarDays, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

function AttendanceEmptyState() {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eef4ff] text-[#0f2d52]">
          <Clock3 className="h-7 w-7" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-[#0f2d52] sm:text-3xl">
          No Meeting In Progress
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
          Attendance opens only when a meeting is currently ongoing. Start or
          schedule a meeting session first, then return here to mark stewards
          present, absent, or pending.
        </p>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          <Link
            to="/dashboard/meetings"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f2d52] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-[#173c67]"
          >
            <CalendarDays className="h-4 w-4 text-white" />
            <p className='text-white'>Go To Meetings</p>
          </Link>
          <div className="rounded-2xl border border-slate-200 bg-[#f7f9fc] px-5 py-3 text-sm text-slate-500">
            Attendance will appear here automatically when a meeting becomes
            active.
          </div>
        </div>
      </div>
    </section>
  )
}

export default AttendanceEmptyState
