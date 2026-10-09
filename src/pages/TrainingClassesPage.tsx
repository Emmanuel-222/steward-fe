import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { useTrainingClassesQuery } from '../features/training/hooks/useTraining'

const statusTone: Record<string, string> = {
  Present: 'bg-emerald-100 text-emerald-700',
  Absent: 'bg-rose-100 text-rose-700',
  Excused: 'bg-amber-100 text-amber-800',
  Unmarked: 'bg-slate-100 text-slate-600',
  Upcoming: 'bg-sky-100 text-sky-700',
}

function TrainingClassesPage() {
  const { data, isLoading, isError, refetch } = useTrainingClassesQuery()

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="My Classes"
        description="The sessions for your track, and whether you were marked present."
      />

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : isError ? (
        <ErrorState message="We couldn't load your classes." onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
          The schedule hasn't been published yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((c) => (
            <li
              key={String(c.id)}
              className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="font-semibold text-brand">
                  {c.week ? `Week ${c.week} · ` : ''}
                  {c.topic ?? 'Training session'}
                </p>
                <p className="text-sm text-slate-600">
                  {c.day}
                  {c.date
                    ? ` · ${new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : ''}
                  {c.startTime ? ` · ${c.startTime}${c.endTime ? `–${c.endTime}` : ''}` : ''}
                  {c.location ? ` · ${c.location}` : ''}
                </p>
                {c.teacher ? <p className="text-xs text-slate-600">Teacher: {c.teacher}</p> : null}
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  statusTone[c.status] ?? statusTone.Unmarked
                }`}
              >
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TrainingClassesPage
