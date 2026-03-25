import { CalendarDays, ChevronDown, X } from 'lucide-react'

type AttendanceFilterModalProps = {
  open: boolean
  onClose: () => void
}

function AttendanceFilterModal({
  open,
  onClose,
}: AttendanceFilterModalProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-filter-title"
      >
        <div className="flex items-start justify-between gap-4">
          <h3
            id="attendance-filter-title"
            className="text-xl font-semibold text-[#0f2d52]"
          >
            Filter Attendance History
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close attendance filter dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-6 space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            onClose()
          }}
        >
          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Meeting Type
            </span>
            <div className="relative">
              <select
                defaultValue="All"
                className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              >
                <option>All</option>
                <option>Sunday Service</option>
                <option>Mid-week Service</option>
                <option>Special Meeting</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Attendance Status
            </span>
            <div className="relative">
              <select
                defaultValue="All"
                className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              >
                <option>All</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Excused</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Date Range
            </span>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">From</span>
              </label>

              <label className="block space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
                  />
                  <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <span className="text-xs text-slate-400">To</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#0f2d52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173c67] sm:w-auto"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AttendanceFilterModal
