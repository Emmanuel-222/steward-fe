import { CalendarDays, Check, ChevronDown, Clock3, Shield } from 'lucide-react'

function AttendanceHero() {
  return (
    <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-[#0f2d52] sm:text-4xl">
          Sunday Morning Service
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            October 22, 2023
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            08:30 AM
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff4fb] text-[#0f2d52]">
            <Shield className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Active Meeting
            </p>
            <p className="truncate text-sm font-semibold text-slate-800">
              Main Sanctuary Steward Shift
            </p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f2d52] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-[#173c67]"
        >
          <Check className="h-4 w-4" />
          Finalize Session
        </button>
      </div>
    </section>
  )
}

export default AttendanceHero
