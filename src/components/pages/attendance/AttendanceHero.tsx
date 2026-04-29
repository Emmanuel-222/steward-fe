import { CalendarDays, Check, ChevronDown, Clock3, Shield } from 'lucide-react'
import type { Meeting } from '../../../features/meetings/types'

type AttendanceHeroProps = {
  meeting: Meeting
  onFinalize?: () => void
  isFinalizing?: boolean
  isFinalized?: boolean
}

function AttendanceHero({
  meeting,
  onFinalize,
  isFinalizing = false,
  isFinalized = false,
}: AttendanceHeroProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
        <span>Steward Registry</span>
        <span className="text-slate-300">/</span>
        <span className="text-[#0f2d52]">Attendance Marking</span>
      </nav>

      <section className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-4xl font-bold tracking-tight text-[#0f2d52]">
              {meeting.title}
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-[#eff4fb] px-3 py-1.5 border border-[#dbe6f5]">
               <div className={`h-2 w-2 rounded-full animate-pulse ${meeting.status === 'Ongoing' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
               <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f2d52]">
                  {meeting.status === 'Ongoing' ? 'Live Session' : meeting.status}
               </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-500">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              {meeting.date}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate-400" />
              {meeting.time}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white px-4 py-3 shadow-[0_15px_45px_rgba(15,23,42,0.05)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff4fb] text-[#0f2d52]">
              <Shield className="h-4 w-4" />
            </div>
            <div className="min-w-0 pr-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Active Meeting
              </p>
              <p className="truncate text-sm font-bold text-slate-800">
                Main Sanctuary Steward Shift
              </p>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </div>

          {!isFinalized && (
            <button
              type="button"
              onClick={onFinalize}
              disabled={isFinalizing}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#0f2d52] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,45,82,0.2)] transition hover:bg-[#173c67] disabled:opacity-70"
            >
              {isFinalizing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isFinalizing ? 'Finalizing...' : 'Finalize Session'}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default AttendanceHero
