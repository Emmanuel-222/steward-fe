import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import useAuth from '../hooks/useAuth'
import GraduationStatusBadge from '../components/pages/training/GraduationStatusBadge'
import {
  useCohortsQuery,
  useCreateCohortMutation,
  useDeleteCohortMutation,
  useTrainingSessionsQuery,
  useTrainingTraineesQuery,
  useUpdateCohortMutation,
} from '../features/training/hooks/useTraining'
import type { CohortListItem } from '../features/training/types'

function cohortTeachers(cohort: CohortListItem) {
  const names = new Set<string>()
  for (const topic of cohort.topics ?? []) {
    if (topic.teacher?.fullName) names.add(topic.teacher.fullName)
  }
  return Array.from(names)
}

function TrainingCohortsPage() {
  const cohortsQuery = useCohortsQuery()
  const createMutation = useCreateCohortMutation()
  const updateMutation = useUpdateCohortMutation()
  const deleteMutation = useDeleteCohortMutation()
  const { user } = useAuth()
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  const { showToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [weekCount, setWeekCount] = useState('12')
  const [maxMissedClasses, setMaxMissedClasses] = useState('3')

  const [renaming, setRenaming] = useState<CohortListItem | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const [deleting, setDeleting] = useState<CohortListItem | null>(null)
  const [deleteName, setDeleteName] = useState('')
  const [tab, setTab] = useState<'cohorts' | 'trainees' | 'sessions'>('cohorts')
  const traineesQuery = useTrainingTraineesQuery(tab === 'trainees')
  const sessionsQuery = useTrainingSessionsQuery(tab === 'sessions')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !startDate) {
      showToast('Name and start date are required', 'error')
      return
    }
    try {
      await createMutation.mutateAsync({
        name,
        startDate,
        weekCount: Number(weekCount),
        maxMissedClasses: Number(maxMissedClasses),
      })
      showToast('Cohort created — add sessions and teachers next', 'success')
      setShowForm(false)
      setName('')
      setStartDate('')
    } catch {
      showToast('Could not create cohort', 'error')
    }
  }

  const handleRename = async () => {
    if (!renaming || !renameValue.trim()) return
    try {
      await updateMutation.mutateAsync({ id: renaming.id, payload: { name: renameValue.trim() } })
      showToast('Cohort renamed', 'success')
      setRenaming(null)
    } catch {
      showToast('Could not rename cohort', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleting || deleteName !== deleting.name) return
    try {
      await deleteMutation.mutateAsync(deleting.id)
      showToast('Cohort deleted', 'success')
      setDeleting(null)
    } catch {
      showToast('Could not delete cohort', 'error')
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Training"
        description="Cohorts of workers in training. Assign a teacher to each session; that teacher owns its class."
        actions={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
          >
            {showForm ? 'Cancel' : 'New cohort'}
          </button>
        }
      />

      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
        {(['cohorts', 'trainees', 'sessions'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold capitalize transition ${
              tab === t ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'cohorts' ? (
        <>
      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="grid gap-4 rounded-card border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Cohort name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="2026 Intake" className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Start date
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Weeks
            <input type="number" min="1" value={weekCount} onChange={(e) => setWeekCount(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
            Allowed missed classes
            <input type="number" min="0" value={maxMissedClasses} onChange={(e) => setMaxMissedClasses(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand" />
          </label>
          <div className="flex items-end sm:col-span-2">
            <button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60">
              {createMutation.isPending ? 'Creating...' : 'Create cohort'}
            </button>
          </div>
        </form>
      ) : null}

      {cohortsQuery.isLoading ? (
        <Spinner />
      ) : cohortsQuery.isError ? (
        <ErrorState message="We couldn't load cohorts." onRetry={() => cohortsQuery.refetch()} />
      ) : (cohortsQuery.data ?? []).length === 0 ? (
        <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
          No cohorts yet. Create one to start enrolling trainees.
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {(cohortsQuery.data ?? []).map((cohort) => {
            const teachers = cohortTeachers(cohort)
            return (
              <li key={cohort.id} className="relative">
                <Link
                  to={`/dashboard/training/${cohort.id}`}
                  className={`block rounded-card border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand/40 hover:shadow-md ${isAdmin ? 'pr-24' : ''}`}
                >
                  <p className="text-lg font-semibold text-brand">{cohort.name}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {teachers.length > 0 ? `Teachers: ${teachers.join(', ')}` : 'No teachers assigned yet'}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-600">
                    {cohort.weekCount} weeks · {cohort._count?.enrollments ?? 0} trainees · miss {cohort.maxMissedClasses} fails
                  </p>
                </Link>

                {isAdmin ? (
                  <div className="absolute right-3 top-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRenaming(cohort)
                        setRenameValue(cohort.name)
                      }}
                      aria-label={`Rename ${cohort.name}`}
                      title="Rename cohort"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-brand"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleting(cohort)
                        setDeleteName('')
                      }}
                      aria-label={`Delete ${cohort.name}`}
                      title="Delete cohort"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </li>
            )
          })}
          {isAdmin ? (
            <li>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="group flex min-h-56 w-full flex-col items-center justify-center rounded-card border border-dashed border-slate-300 bg-[#f8fbff] p-8 text-center transition hover:border-brand hover:bg-white"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1ff] text-brand">
                  <Plus className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-brand">New cohort</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
                  Start a new intake of workers in training.
                </p>
              </button>
            </li>
          ) : null}
        </ul>
      )}
        </>
      ) : tab === 'trainees' ? (
        <section>
          {traineesQuery.isLoading ? (
            <Spinner />
          ) : traineesQuery.isError ? (
            <ErrorState message="We couldn't load trainees." onRetry={() => traineesQuery.refetch()} />
          ) : (traineesQuery.data ?? []).length === 0 ? (
            <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
              No trainees yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-card border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Cohort</th>
                    <th className="px-4 py-3">Track</th>
                    <th className="px-4 py-3">Missed</th>
                    <th className="px-4 py-3">Standing</th>
                  </tr>
                </thead>
                <tbody>
                  {(traineesQuery.data ?? []).map((t) => (
                    <tr key={`${t.cohortId}-${t.userId}`} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{t.name}</p>
                        <p className="text-xs text-slate-600">{t.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{t.cohortName}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section>
          {sessionsQuery.isLoading ? (
            <Spinner />
          ) : sessionsQuery.isError ? (
            <ErrorState message="We couldn't load sessions." onRetry={() => sessionsQuery.refetch()} />
          ) : (sessionsQuery.data ?? []).length === 0 ? (
            <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
              No sessions scheduled yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {(sessionsQuery.data ?? []).map((s) => (
                <li
                  key={s.classId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-brand">
                      {s.week ? `Week ${s.week} · ` : ''}
                      {s.topic ?? 'Training session'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {s.cohortName} ·{' '}
                      {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
                      {s.startTime}–{s.endTime} · {s.location}
                    </p>
                    {s.teacher ? <p className="text-xs text-slate-600">Teacher: {s.teacher}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Rename modal */}
      {renaming ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px]"
          onClick={() => setRenaming(null)}
        >
          <div className="flex min-h-full items-center justify-center px-4 py-6">
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="rename-cohort-title"
            >
              <h3 id="rename-cohort-title" className="text-xl font-semibold text-slate-900">
                Rename cohort
              </h3>
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand"
              />
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenaming(null)}
                  className="rounded-xl bg-[#eef3ff] px-4 py-2.5 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRename}
                  disabled={updateMutation.isPending || !renameValue.trim()}
                  className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete modal — type the name to confirm */}
      {deleting ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px]"
          onClick={() => setDeleting(null)}
        >
          <div className="flex min-h-full items-center justify-center px-4 py-6">
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-cohort-title"
            >
              <h3 id="delete-cohort-title" className="text-xl font-semibold text-slate-900">
                Delete cohort
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This permanently removes <span className="font-semibold text-slate-800">{deleting.name}</span>{' '}
                with its curriculum, sessions and enrollments. Type the cohort name to confirm.
              </p>
              <input
                value={deleteName}
                onChange={(e) => setDeleteName(e.target.value)}
                placeholder={deleting.name}
                autoFocus
                className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-400"
              />
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleting(null)}
                  className="rounded-xl bg-[#eef3ff] px-4 py-2.5 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending || deleteName !== deleting.name}
                  className="rounded-xl bg-[#d92d20] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b42318] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete cohort'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default TrainingCohortsPage
