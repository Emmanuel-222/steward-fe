import { GraduationCap } from 'lucide-react'
import type { ReactNode } from 'react'
import GraduationStatusBadge from './GraduationStatusBadge'
import type { RollupTrainee } from '../../../features/training/types'

type TrainingTraineesTableProps = {
  trainees: RollupTrainee[]
  scope?: 'cohort' | 'global'
  onGraduate?: (trainee: RollupTrainee) => void
  isGraduating?: boolean
  emptyMessage?: string
  renderActions?: (trainee: RollupTrainee) => ReactNode
}

const roleTone: Record<string, string> = {
  Steward: 'bg-emerald-100 text-emerald-700',
  Leader: 'bg-blue-100 text-blue-700',
  Pastor: 'bg-rose-100 text-rose-700',
  Admin: 'bg-amber-100 text-amber-700',
  Trainee: 'bg-[#eef4ff] text-brand',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function NameCell({ trainee }: { trainee: RollupTrainee }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#dfeafa] text-xs font-semibold text-brand">
        {initials(trainee.name)}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-800">{trainee.name}</p>
        <p className="truncate text-xs text-slate-600">{trainee.email}</p>
      </div>
    </div>
  )
}

function TrainingTraineesTable({
  trainees,
  scope = 'cohort',
  onGraduate,
  isGraduating = false,
  emptyMessage = 'No trainees yet.',
  renderActions,
}: TrainingTraineesTableProps) {
  if (trainees.length === 0) {
    return (
      <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
        {emptyMessage}
      </div>
    )
  }

  const isGlobal = scope === 'global'

  return (
    <div className="overflow-x-auto rounded-card border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-600">
            <th className="px-4 py-3">Full Name</th>
            {isGlobal ? (
              <>
                <th className="px-4 py-3">Cohort</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date Added</th>
                {renderActions ? (
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                ) : null}
              </>
            ) : (
              <>
                <th className="px-4 py-3">Track</th>
                <th className="px-4 py-3">Missed</th>
                <th className="px-4 py-3">Standing</th>
                {onGraduate ? (
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                ) : null}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {trainees.map((t) => (
            <tr key={`${t.cohortId}-${t.id}`} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-3">
                <NameCell trainee={t} />
              </td>

              {isGlobal ? (
                <>
                  <td className="px-4 py-3 text-slate-700">{t.cohortName}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-medium text-[#3f5a8f]">
                      {t.department ?? 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        roleTone[t.role ?? ''] ?? 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.role ?? 'Trainee'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{t.phone ?? 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-700">{t.dateAdded ?? 'N/A'}</td>
                  {renderActions ? <td className="px-4 py-3 text-right">{renderActions(t)}</td> : null}
                </>
              ) : (
                <>
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
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TrainingTraineesTable
