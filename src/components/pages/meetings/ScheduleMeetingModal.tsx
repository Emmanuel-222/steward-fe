import {
  Calendar as CalendarIcon,
  ChevronDown,
  Clock3,
  Info,
  X,
} from 'lucide-react'

type ScheduleMeetingModalProps = {
  open: boolean
  onClose: () => void
}

function ScheduleMeetingModal({
  open,
  onClose,
}: ScheduleMeetingModalProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-meeting-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="schedule-meeting-title"
              className="text-xl font-semibold text-[#0f2d52]"
            >
              Schedule New Meeting
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Define the parameters for the new registrar session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close schedule meeting dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
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
                defaultValue="Sunday Service"
                className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              >
                <option>Sunday Service</option>
                <option>Mid-Week Vigil</option>
                <option>Monthly Steward Meeting</option>
                <option>Choir Rehearsal</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Date
            </span>
            <div className="relative">
              <input
                type="text"
                defaultValue="05/21/2024"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Start Time
              </span>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="09:00 AM"
                  className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                />
                <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Cutoff Time
              </span>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="09:30 AM"
                  className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                />
                <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </label>
          </div>

          <div className="flex gap-3 rounded-xl bg-[#f3f7fd] px-4 py-3 text-xs leading-5 text-slate-500">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5d74a2]" />
            <p>
              Attendance will be marked as Absent automatically after the cutoff
              time of 09:30 AM.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#0f2d52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173c67]"
            >
              Create Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleMeetingModal
