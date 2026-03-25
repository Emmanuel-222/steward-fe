import { Plus, Shield } from 'lucide-react'

function AttendanceInsightBanner() {
  return (
    <section className="rounded-[30px] bg-[#0f2d52] p-6 text-white shadow-[0_20px_60px_rgba(15,45,82,0.24)]">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            <Shield className="h-4 w-4" />
            Sunday Rush Mode
          </span>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Attendance is progressing well.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
              Most stewards are expected by 08:45 AM for the pre-service
              briefing. Keep the registry open for late arrivals.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/8 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
              Expected Soon
            </p>
            <p className="mt-3 text-4xl font-semibold">14</p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 text-[#0f2d52]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              In Attendance
            </p>
            <p className="mt-3 text-4xl font-semibold">86</p>
          </div>
          <button
            type="button"
            className="flex h-full min-h-[104px] items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/15"
            aria-label="Quick add"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default AttendanceInsightBanner
