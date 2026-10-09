import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import useAuth from '../hooks/useAuth'
import {
  useCohortsQuery,
  useCreateCohortMutation,
  useDeleteCohortMutation,
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
        </ul>
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
