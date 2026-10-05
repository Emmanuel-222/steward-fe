import type { GraduationStatus } from '../../../features/training/types'
import { graduationLabel } from '../../../features/training/api'

const tone: Record<GraduationStatus, string> = {
  on_track: 'bg-emerald-100 text-emerald-700',
  at_risk: 'bg-amber-100 text-amber-800',
  will_not_graduate: 'bg-rose-100 text-rose-700',
}

function GraduationStatusBadge({ status }: { status: GraduationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone[status]}`}
    >
      {graduationLabel(status)}
    </span>
  )
}

export default GraduationStatusBadge
