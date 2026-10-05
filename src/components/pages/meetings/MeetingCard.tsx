import {
  CalendarDays,
  MapPinHouse,
  Pencil,
  Eye,
  Trash2,
} from 'lucide-react'
import type { Meeting } from '../../../features/meetings/types'

import useAuth from '../../../hooks/useAuth'

type MeetingCardProps = {
  meeting: Meeting
  onEdit: (meeting: Meeting) => void
  onDelete: (meeting: Meeting) => void
  onAction: (meeting: Meeting) => void
}

function MeetingCard({ meeting, onEdit, onDelete, onAction }: MeetingCardProps) {
  const { user } = useAuth()
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  const today = new Date().toISOString().split('T')[0]
  const isToday = meeting.rawDate === today
  const hasStats = meeting.present !== null && meeting.absent !== null

  return (
    <article
      className={[
        'min-w-0 rounded-card border bg-white p-5 shadow-card transition hover:shadow-section',
        isToday ? 'border-brand/20 ring-2 ring-brand/10' : 'border-slate-200',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${meeting.statusTone}`}
          >
            {meeting.status}
          </span>
          {meeting.type ? (
            <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
              {meeting.type}
            </span>
          ) : null}
        </div>
        {isToday ? (
          <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Today
          </span>
        ) : null}
      </div>

      <div className="mt-4 min-w-0">
        <h3 className="break-words text-lg font-semibold text-brand">{meeting.title}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
          <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="break-words">
            {meeting.date} · {meeting.time}
          </span>
        </p>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
          <MapPinHouse className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="break-words">{meeting.location}</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {hasStats ? (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef6ff] px-3 py-1 font-semibold text-brand tabular-nums">
              {meeting.present} present
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1f3] px-3 py-1 font-semibold text-[#b42318] tabular-nums">
              {meeting.absent} absent
            </span>
          </>
        ) : (
          <span className="rounded-full bg-[#f6f8fb] px-3 py-1 text-xs font-medium text-slate-600">
            Attendance after session starts
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAction(meeting)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          <Eye className="h-4 w-4" />
          {meeting.primaryAction}
        </button>

        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => onEdit(meeting)}
              aria-label="Edit meeting"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(meeting)}
              aria-label="Delete meeting"
              className="inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        ) : null}
      </div>
    </article>
  )
}

export default MeetingCard
