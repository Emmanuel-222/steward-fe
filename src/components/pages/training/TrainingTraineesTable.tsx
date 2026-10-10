import { GraduationCap } from 'lucide-react'
import GraduationStatusBadge from './GraduationStatusBadge'
import type { RollupTrainee } from '../../../features/training/types'

type TrainingTraineesTableProps = {
  trainees: RollupTrainee[]
  showCohort?: boolean
  onGraduate?: (trainee: RollupTrainee) => void
  isGraduating?: boolean
  emptyMessage?: string
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function TrainingTraineesTable({
  trainees,
  showCohort = false,
  onGraduate,
  isGraduating = false,
  emptyMessage = 'No trainees yet.',
}: TrainingTraineesTableProps) {
  if (trainees.length === 0) {
    return (
      <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-card border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-600">
            <th className="px-4 py-3">Name</th>
            {showCohort ? <th className="px-4 py-3">Cohort</th> : null}
            <th className="px-4 py-3">Track</th>
            <th className="px-4 py-3">Missed</th>
            <th className="px-4 py-3">Standing</th>
            {onGraduate ? (
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {trainees.map((t) => (
            <tr key={`${t.cohortId}-${t.id}`} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#dfeafa] text-xs font-semibold text-brand">
                    {initials(t.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{t.name}</p>
                    <p className="truncate text-xs text-slate-600">{t.email}</p>
                  </div>
                </div>
              </td>
              {showCohort ? <td className="px-4 py-3 text-slate-700">{t.cohortName}</td> : null}
              <td className="px-4 py-3">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700">
                  {t.track}
                </span>
              </td>
              <td className="px-4 py-3 tabular-nums text-slate-700">
                {t.missed} / {t.maxMissedClasses}
              </td>
              <td className="px-4 py-3">
                <GraduationStatusBadge status={t.graduation} />
              </td>
              {onGraduate ? (
                <td className="px-4 py-3 text-right">
                  {t.enrollmentStatus === 'enrolled' ? (
                    <button
                      type="button"
                      onClick={() => onGraduate(t)}
                      disabled={isGraduating || t.graduation === 'will_not_graduate'}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <GraduationCap className="h-3.5 w-3.5" /> Graduate
                    </button>
                  ) : (
                    <span className="text-xs font-semibold uppercase text-slate-600">
                      {t.enrollmentStatus}
                    </span>
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TrainingTraineesTable
