import {
  CalendarDays,
  Clock3,
  Pencil,
  Eye,
  Search,
  Settings2,
  Trash2,
} from 'lucide-react'
import type { Meeting } from '../../../features/meetings/types'

type MeetingCardProps = {
  meeting: Meeting
  onEdit: (meeting: Meeting) => void
  onDelete: (meeting: Meeting) => void
}

function MeetingCard({ meeting, onEdit, onDelete }: MeetingCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meeting.statusTone}`}
        >
          {meeting.status}
        </span>
        <button type="button" className="text-slate-400">
          <Settings2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-2">
        <h3 className="text-xl font-semibold text-[#0f2d52]">{meeting.title}</h3>
        <p className="text-sm text-slate-500">{meeting.subtitle}</p>
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-500">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          <span>{meeting.date}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="h-4 w-4 text-slate-400" />
          <span>{meeting.time}</span>
        </div>
        <div className="flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          <span>{meeting.location}</span>
        </div>
      </div>

      {meeting.present !== null && meeting.absent !== null ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#eef6ff] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Present
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#0f2d52]">
              {meeting.present}
            </p>
          </div>
          <div className="rounded-2xl bg-[#fff1f3] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Absent
            </p>
            <p className="mt-2 text-3xl font-semibold text-[#b42318]">
              {meeting.absent}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-[#f6f8fb] p-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Attendance Stats
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Available after session starts
          </p>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2d52] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#173c67]"
        >
          <Eye className="h-4 w-4" />
          {meeting.primaryAction}
        </button>
        <button
          type="button"
          onClick={() => onEdit(meeting)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4" />
          {meeting.secondaryAction}
        </button>
        <button
          type="button"
          onClick={() => onDelete(meeting)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </article>
  )
}

export default MeetingCard
