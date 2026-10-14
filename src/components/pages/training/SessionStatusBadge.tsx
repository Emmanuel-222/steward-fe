import type { SessionStatus } from '../../../features/training/types'

const tone: Record<SessionStatus, string> = {
  Upcoming: 'bg-slate-100 text-slate-600',
  Ongoing: 'bg-[#eaf1ff] text-brand',
  Completed: 'bg-emerald-100 text-emerald-700',
}

function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone[status]}`}
    >
      {status}
    </span>
  )
}

export default SessionStatusBadge
