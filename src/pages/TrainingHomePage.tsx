import { GraduationCap, MapPin } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import GraduationStatusBadge from '../components/pages/training/GraduationStatusBadge'
import { useTrainingMeQuery } from '../features/training/hooks/useTraining'

function formatClassDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function TrainingHomePage() {
  const { data, isLoading, isError, refetch } = useTrainingMeQuery()

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="School"
        description="Your training progress, this week's topic, and your next class."
      />

      {isLoading ? (
        <Spinner />
      ) : isError || !data ? (
        <ErrorState message="We couldn't load your training record." onRetry={() => refetch()} />
      ) : (
        <>
          <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                  {data.cohort.name}
                </p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-600">
                  {data.cohort.track} track
                </p>
              </div>
              <GraduationStatusBadge status={data.graduation} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {data.missed} missed of {data.cohort.maxMissedClasses} allowed
              </span>
              <span>{data.cohort.weekCount}-week program</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                This week's topic
              </p>
              {data.currentTopic ? (
                <>
                  <p className="mt-2 text-lg font-semibold text-brand">
                    Week {data.currentTopic.weekNumber}: {data.currentTopic.title}
                  </p>
                  {data.currentTopic.description ? (
                    <p className="mt-1 text-sm text-slate-600">{data.currentTopic.description}</p>
                  ) : null}
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No topic set for this week yet.</p>
              )}
            </article>

            <article className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Next class
              </p>
              {data.nextClass ? (
                <>
                  <p className="mt-2 text-lg font-semibold text-brand">
                    {formatClassDate(data.nextClass.date)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {data.nextClass.startTime} – {data.nextClass.endTime}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" /> {data.nextClass.location}
                  </p>
                  {data.nextClass.topic ? (
                    <p className="mt-2 text-sm text-slate-600">Topic: {data.nextClass.topic}</p>
                  ) : null}
                  {data.nextClass.teacher ? (
                    <p className="mt-1 text-sm text-slate-600">Teacher: {data.nextClass.teacher}</p>
                  ) : null}
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No upcoming class scheduled.</p>
              )}
            </article>
          </div>
        </>
      )}
    </div>
  )
}

export default TrainingHomePage
