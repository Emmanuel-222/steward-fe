import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import { useCohortsQuery, useCreateCohortMutation } from '../features/training/hooks/useTraining'

function cohortTeachers(cohort: {
  topics?: Array<{ teacherId: number | null; teacher: { id: number; fullName: string } | null }>
}) {
  const names = new Set<string>()
  for (const topic of cohort.topics ?? []) {
    if (topic.teacher?.fullName) names.add(topic.teacher.fullName)
  }
  return Array.from(names)
}

function TrainingCohortsPage() {
  const cohortsQuery = useCohortsQuery()
  const createMutation = useCreateCohortMutation()
  const { showToast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [weekCount, setWeekCount] = useState('12')
  const [maxMissedClasses, setMaxMissedClasses] = useState('3')

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
      showToast('Cohort created — add topics and assign a teacher to each week', 'success')
      setShowForm(false)
      setName('')
      setStartDate('')
    } catch {
      showToast('Could not create cohort', 'error')
    }
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Training"
        description="Cohorts of workers in training. Assign a teacher to each week's topic; that teacher owns its class."
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
          })}
        </ul>
      )}
    </div>
  )
}

export default TrainingCohortsPage
