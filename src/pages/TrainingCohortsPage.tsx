import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'
import TrainingRollup from '../components/pages/training/TrainingRollup'
import TraineeRowActions from '../components/pages/training/TraineeRowActions'
import EditTraineeModal, { type EditTraineeValues } from '../components/pages/training/EditTraineeModal'
import DeleteUserModal from '../components/pages/stewards/DeleteUserModal'
import { useToast } from '../hooks/useToast'
import useAuth from '../hooks/useAuth'
import {
  useCohortsQuery,
  useCreateCohortMutation,
  useDeleteCohortMutation,
  useDeleteTraineeMutation,
  useGraduateTraineeAnyMutation,
  useTrainingSessionsQuery,
  useTrainingTraineesQuery,
  useUpdateCohortMutation,
  useUpdateTraineeProfileMutation,
  useUpdateTraineeTrackMutation,
} from '../features/training/hooks/useTraining'
import { toRollupSessionsGlobal, toRollupTraineesGlobal } from '../features/training/adapters'
import type { CohortListItem, RollupTrainee } from '../features/training/types'
import type { Steward } from '../features/stewards/types'

const CARD_PAGE_SIZE = 6

function cohortTeachers(cohort: CohortListItem) {
  const names = new Set<string>()
  for (const topic of cohort.topics ?? []) {
    if (topic.teacher?.fullName) names.add(topic.teacher.fullName)
  }
  return Array.from(names)
}

function TrainingCohortsPage() {
  const cohortsQuery = useCohortsQuery()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  const traineesQuery = useTrainingTraineesQuery(isAdmin)
  const sessionsQuery = useTrainingSessionsQuery(isAdmin)
  const createMutation = useCreateCohortMutation()
  const updateCohortMutation = useUpdateCohortMutation()
  const deleteCohortMutation = useDeleteCohortMutation()
  const graduateAny = useGraduateTraineeAnyMutation()
  const updateProfile = useUpdateTraineeProfileMutation()
  const updateTrack = useUpdateTraineeTrackMutation()
  const deleteTraineeMutation = useDeleteTraineeMutation()
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const forceList = searchParams.get('list') === '1'

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [weekCount, setWeekCount] = useState('12')
  const [maxMissedClasses, setMaxMissedClasses] = useState('3')
  const [page, setPage] = useState(1)
  const [editingTrainee, setEditingTrainee] = useState<RollupTrainee | null>(null)
  const [deletingTrainee, setDeletingTrainee] = useState<RollupTrainee | null>(null)
  const [renamingCohort, setRenamingCohort] = useState<CohortListItem | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingCohort, setDeletingCohort] = useState<CohortListItem | null>(null)
  const [deleteName, setDeleteName] = useState('')

  const cohorts = cohortsQuery.data ?? []

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

  const totalPages = Math.max(1, Math.ceil(cohorts.length / CARD_PAGE_SIZE))
  const pagedCohorts = cohorts.slice((page - 1) * CARD_PAGE_SIZE, page * CARD_PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages) // eslint-disable-line react-hooks/set-state-in-effect -- clamp the page when the cohort count shrinks
  }, [page, totalPages])

  // With a single cohort there is nothing to choose — go straight in,
  // unless the user explicitly asked for the list (?list=1).
  if (!cohortsQuery.isLoading && !cohortsQuery.isError && cohorts.length === 1 && !showForm && !forceList) {
    return <Navigate to={`/dashboard/training/${cohorts[0].id}`} replace />
  }

  const rollupTrainees = toRollupTraineesGlobal(traineesQuery.data ?? [])
  const rollupSessions = toRollupSessionsGlobal(sessionsQuery.data ?? [])
  const rollupError = traineesQuery.isError || sessionsQuery.isError

  const asSteward = (trainee: RollupTrainee): Steward => ({
    id: String(trainee.id),
    initials: '',
    name: trainee.name,
    email: trainee.email,
    department: trainee.department ?? '',
    role: trainee.role ?? 'Trainee',
    roleTone: '',
    phone: trainee.phone ?? '',
    dateAdded: trainee.dateAdded ?? '',
  })

  const handleViewTrainee = (trainee: RollupTrainee) => {
    navigate(`/dashboard/stewards/${trainee.id}`)
  }

  const handleGraduateTrainee = async (trainee: RollupTrainee) => {
    try {
      await graduateAny.mutateAsync({ cohortId: trainee.cohortId, userId: trainee.id })
      showToast(`${trainee.name} graduated and moved to worker`, 'success')
    } catch {
      showToast('Could not graduate trainee', 'error')
    }
  }

  const handleEditTrainee = async (values: EditTraineeValues) => {
    if (!editingTrainee) return
    try {
      await updateProfile.mutateAsync({
        userId: editingTrainee.id,
        payload: { fullName: values.name, phone: values.phone, birthday: values.birthday },
      })
      if (values.track !== editingTrainee.track) {
        await updateTrack.mutateAsync({
          cohortId: editingTrainee.cohortId,
          userId: editingTrainee.id,
          track: values.track,
        })
      }
      showToast('Trainee updated', 'success')
    } catch (error) {
      showToast('Could not update trainee', 'error')
      throw error
    }
  }

  const handleDeleteTrainee = async () => {
    if (!deletingTrainee) return
    try {
      await deleteTraineeMutation.mutateAsync(deletingTrainee.id)
      showToast('Trainee removed', 'success')
      setDeletingTrainee(null)
    } catch {
      showToast('Could not delete trainee', 'error')
    }
  }

  const handleRename = async () => {
    if (!renamingCohort || !renameValue.trim()) return
    try {
      await updateCohortMutation.mutateAsync({
        id: renamingCohort.id,
        payload: { name: renameValue.trim() },
      })
      showToast('Cohort renamed', 'success')
      setRenamingCohort(null)
    } catch {
      showToast('Could not rename cohort', 'error')
    }
  }

  const handleDeleteCohort = async () => {
    if (!deletingCohort || deleteName !== deletingCohort.name) return
    try {
      await deleteCohortMutation.mutateAsync(deletingCohort.id)
      showToast('Cohort deleted', 'success')
      setDeletingCohort(null)
    } catch {
      showToast('Could not delete cohort', 'error')
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
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {cohorts.length === 0 ? (
              <li>
                <div className="flex min-h-56 flex-col items-center justify-center rounded-card border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="text-lg font-semibold text-brand">No cohorts yet.</p>
                  <p className="mt-2 text-sm text-slate-600">Create one to start enrolling trainees.</p>
                </div>
              </li>
            ) : (
              pagedCohorts.map((cohort) => {
                const teachers = cohortTeachers(cohort)
                return (
                  <li
                    key={cohort.id}
                    className="flex flex-col overflow-hidden rounded-card border border-slate-200 bg-white shadow-sm transition hover:border-brand/40 hover:shadow-md"
                  >
                    <Link to={`/dashboard/training/${cohort.id}`} className="flex flex-1 flex-col p-5">
                      <p className="text-lg font-semibold text-brand">{cohort.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {teachers.length > 0 ? `Teachers: ${teachers.join(', ')}` : 'No teachers assigned yet'}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-600">
                        {cohort.weekCount} weeks · {cohort._count?.enrollments ?? 0} trainees · miss {cohort.maxMissedClasses} fails
                      </p>
                    </Link>
                    {isAdmin ? (
                      <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRenameValue(cohort.name)
                            setRenamingCohort(cohort)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteName('')
                            setDeletingCohort(cohort)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    ) : null}
                  </li>
                )
              })
            )}

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

          {cohorts.length > CARD_PAGE_SIZE ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={cohorts.length}
              pageSize={CARD_PAGE_SIZE}
              onPageChange={setPage}
            />
          ) : null}

          {isAdmin && cohorts.length > 0 ? (
            <TrainingRollup
              trainees={rollupTrainees}
              sessions={rollupSessions}
              isLoading={traineesQuery.isLoading || sessionsQuery.isLoading}
              errorMessage={rollupError ? "We couldn't load the cohort overview." : undefined}
              onRetry={() => {
                traineesQuery.refetch()
                sessionsQuery.refetch()
              }}
              onOpenCohort={(cohortId) => navigate(`/dashboard/training/${cohortId}`)}
              renderTraineeActions={(trainee) => (
                <TraineeRowActions
                  trainee={trainee}
                  onView={handleViewTrainee}
                  onEdit={setEditingTrainee}
                  onGraduate={handleGraduateTrainee}
                  onDelete={setDeletingTrainee}
                />
              )}
            />
          ) : null}

          <EditTraineeModal
            key={editingTrainee?.id ?? 'none'}
            trainee={editingTrainee}
            open={Boolean(editingTrainee)}
            onClose={() => setEditingTrainee(null)}
            onSubmit={handleEditTrainee}
            isSubmitting={updateProfile.isPending || updateTrack.isPending}
          />
          <DeleteUserModal
            steward={deletingTrainee ? asSteward(deletingTrainee) : null}
            open={Boolean(deletingTrainee)}
            onClose={() => setDeletingTrainee(null)}
            onConfirm={handleDeleteTrainee}
            isSubmitting={deleteTraineeMutation.isPending}
          />

          {renamingCohort ? (
            <div
              className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px]"
              onClick={() => setRenamingCohort(null)}
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
                      onClick={() => setRenamingCohort(null)}
                      className="rounded-xl bg-[#eef3ff] px-4 py-2.5 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRename}
                      disabled={updateCohortMutation.isPending || !renameValue.trim()}
                      className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
                    >
                      {updateCohortMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {deletingCohort ? (
            <div
              className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px]"
              onClick={() => setDeletingCohort(null)}
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
                    This permanently removes{' '}
                    <span className="font-semibold text-slate-800">{deletingCohort.name}</span> with its
                    curriculum, sessions and enrollments. Type the cohort name to confirm.
                  </p>
                  <input
                    value={deleteName}
                    onChange={(e) => setDeleteName(e.target.value)}
                    placeholder={deletingCohort.name}
                    autoFocus
                    className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-rose-400"
                  />
                  <div className="mt-5 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setDeletingCohort(null)}
                      className="rounded-xl bg-[#eef3ff] px-4 py-2.5 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteCohort}
                      disabled={deleteCohortMutation.isPending || deleteName !== deletingCohort.name}
                      className="rounded-xl bg-[#d92d20] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b42318] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleteCohortMutation.isPending ? 'Deleting...' : 'Delete cohort'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

export default TrainingCohortsPage
