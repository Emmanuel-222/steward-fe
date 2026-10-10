import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'
import TrainingRollup from '../components/pages/training/TrainingRollup'
import { useToast } from '../hooks/useToast'
import useAuth from '../hooks/useAuth'
import {
  useCohortsQuery,
  useCreateCohortMutation,
  useTrainingSessionsQuery,
  useTrainingTraineesQuery,
} from '../features/training/hooks/useTraining'
import { toRollupSessionsGlobal, toRollupTraineesGlobal } from '../features/training/adapters'
import type { CohortListItem } from '../features/training/types'

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
  const traineesQuery = useTrainingTraineesQuery()
  const sessionsQuery = useTrainingSessionsQuery()
  const createMutation = useCreateCohortMutation()
  const { user } = useAuth()
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const forceList = searchParams.get('list') === '1'

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [weekCount, setWeekCount] = useState('12')
  const [maxMissedClasses, setMaxMissedClasses] = useState('3')
  const [page, setPage] = useState(1)

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

  // With a single cohort there is nothing to choose — go straight in,
  // unless the user explicitly asked for the list (?list=1).
  if (!cohortsQuery.isLoading && !cohortsQuery.isError && cohorts.length === 1 && !showForm && !forceList) {
    return <Navigate to={`/dashboard/training/${cohorts[0].id}`} replace />
  }

  const totalPages = Math.max(1, Math.ceil(cohorts.length / CARD_PAGE_SIZE))
  const pagedCohorts = cohorts.slice((page - 1) * CARD_PAGE_SIZE, page * CARD_PAGE_SIZE)

  const rollupTrainees = toRollupTraineesGlobal(traineesQuery.data ?? [])
  const rollupSessions = toRollupSessionsGlobal(sessionsQuery.data ?? [])
  const rollupError = traineesQuery.isError || sessionsQuery.isError

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
                  <li key={cohort.id}>
                    <Link
                      to={`/dashboard/training/${cohort.id}`}
                      className="block rounded-card border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand/40 hover:shadow-md"
                    >
                      <p className="text-lg font-semibold text-brand">{cohort.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {teachers.length > 0 ? `Teachers: ${teachers.join(', ')}` : 'No teachers assigned yet'}
                      </p>
                      <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-600">
                        {cohort.weekCount} weeks · {cohort._count?.enrollments ?? 0} trainees · miss {cohort.maxMissedClasses} fails
                      </p>
                    </Link>
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

          {cohorts.length > 0 ? (
            <TrainingRollup
              trainees={rollupTrainees}
              sessions={rollupSessions}
              isLoading={traineesQuery.isLoading || sessionsQuery.isLoading}
              errorMessage={rollupError ? "We couldn't load the cohort overview." : undefined}
              onRetry={() => {
                traineesQuery.refetch()
                sessionsQuery.refetch()
              }}
            />
          ) : null}
        </>
      )}
    </div>
  )
}

export default TrainingCohortsPage
