import SessionStatusBadge from './SessionStatusBadge'
import type { RollupSession } from '../../../features/training/types'

type TrainingSessionsListProps = {
  sessions: RollupSession[]
  showCohort?: boolean
  emptyMessage?: string
}

function TrainingSessionsList({
  sessions,
  showCohort = false,
  emptyMessage = 'No sessions scheduled yet.',
}: TrainingSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {sessions.map((s) => (
        <li
          key={`${s.cohortId}-${s.id}`}
          className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="min-w-0">
            <p className="font-semibold text-brand">
              {s.week ? `Week ${s.week} · ` : ''}
              {s.topic ?? 'Training session'}
            </p>
            <p className="text-sm text-slate-600">
              {showCohort ? `${s.cohortName} · ` : ''}
              {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
              {s.startTime}
              {s.endTime ? `–${s.endTime}` : ''} · {s.location}
            </p>
            {s.teacher ? <p className="text-xs text-slate-600">Teacher: {s.teacher}</p> : null}
          </div>
          <SessionStatusBadge status={s.status} />
        </li>
      ))}
    </ul>
  )
}

export default TrainingSessionsList
