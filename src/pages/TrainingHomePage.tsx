import { useState } from 'react'
import { ChevronDown, GraduationCap, MapPin } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import GraduationStatusBadge from '../components/pages/training/GraduationStatusBadge'
import { useTrainingClassesQuery, useTrainingMeQuery } from '../features/training/hooks/useTraining'

const statusTone: Record<string, string> = {
  Present: 'bg-emerald-100 text-emerald-700',
  Absent: 'bg-rose-100 text-rose-700',
  Excused: 'bg-amber-100 text-amber-800',
  Unmarked: 'bg-slate-100 text-slate-600',
  Upcoming: 'bg-sky-100 text-sky-700',
}

function formatClassDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function TrainingHomePage() {
  const meQuery = useTrainingMeQuery()
  const classesQuery = useTrainingClassesQuery()

  const { data, isLoading, isError, refetch } = meQuery
  const curriculum = classesQuery.data ?? []
  const [curriculumOpen, setCurriculumOpen] = useState(true)

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="School"
        description="Your training path, this week's topic, and your own curriculum."
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
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white capitalize">
                    {data.cohort.track}
                  </span>
                  track
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

          <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="button"
              onClick={() => setCurriculumOpen((v) => !v)}
              aria-expanded={curriculumOpen}
              className="flex w-full items-start justify-between gap-3 text-left"
            >
              <div>
                <h2 className="text-lg font-semibold text-brand">Your curriculum</h2>
                <p className="mt-1 text-sm text-slate-600">
                  The {curriculum.length} session{curriculum.length === 1 ? '' : 's'} for your{' '}
                  <span className="font-semibold capitalize">{data.cohort.track}</span> track.
                </p>
              </div>
              <ChevronDown
                className={`mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                  curriculumOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {curriculumOpen ? (
              classesQuery.isLoading ? (
                <Spinner />
              ) : curriculum.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">The schedule hasn't been published yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {curriculum.map((c) => (
                    <li
                      key={String(c.id)}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand">
                          {c.week ? `Week ${c.week} · ` : ''}
                          {c.topic ?? 'Training session'}
                        </p>
                        <p className="text-xs text-slate-600">
                          {c.day}
                          {c.date
                            ? ` · ${new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : ''}
                          {c.startTime ? ` · ${c.startTime}${c.endTime ? `–${c.endTime}` : ''}` : ''}
                          {c.teacher ? ` · ${c.teacher}` : ''}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          statusTone[c.status] ?? statusTone.Unmarked
                        }`}
                      >
                        {c.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )
            ) : null}
          </section>
        </>
      )}
    </div>
  )
}

export default TrainingHomePage
