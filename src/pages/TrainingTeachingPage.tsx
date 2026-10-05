import { useState } from 'react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { useToast } from '../hooks/useToast'
import {
  useClassRosterQuery,
  useMarkTrainingAttendanceMutation,
  useTeachingQuery,
} from '../features/training/hooks/useTraining'

const statusTone: Record<string, string> = {
  present: 'bg-emerald-100 text-emerald-700',
  late: 'bg-amber-100 text-amber-800',
  absent: 'bg-rose-100 text-rose-700',
  excused: 'bg-slate-100 text-slate-600',
}

function TrainingTeachingPage() {
  const teachingQuery = useTeachingQuery()
  const [selected, setSelected] = useState<number | null>(null)
  const rosterQuery = useClassRosterQuery(selected)
  const markMutation = useMarkTrainingAttendanceMutation(selected)
  const { showToast } = useToast()

  const mark = async (userId: number, meetingId: number, status: string) => {
    try {
      await markMutation.mutateAsync({ userId, meetingId, status })
    } catch {
      showToast('Could not save attendance', 'error')
    }
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Teaching"
        description="Classes you teach. Mark each trainee present or absent."
      />

      {teachingQuery.isLoading ? (
        <Skeleton className="h-64" />
      ) : teachingQuery.isError ? (
        <ErrorState message="We couldn't load your classes." onRetry={() => teachingQuery.refetch()} />
      ) : !teachingQuery.data?.isTeacher ? (
        <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
          You are not currently assigned to teach any class.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <ul className="space-y-2">
            {teachingQuery.data.classes.map((c) => (
              <li key={c.classId}>
                <button
                  type="button"
                  onClick={() => setSelected(c.classId)}
                  className={`w-full rounded-card border p-4 text-left transition ${
                    selected === c.classId
                      ? 'border-brand bg-brand/5'
                      : 'border-slate-200 bg-white hover:border-brand/40'
                  }`}
                >
                  <p className="font-semibold text-brand">
                    {c.topic ? `Week ${c.week}: ${c.topic}` : 'Training class'}
                  </p>
                  <p className="text-xs text-slate-600">{c.cohortName}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
                    {c.startTime}–{c.endTime} · {c.location}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <section className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
            {selected == null ? (
              <p className="text-sm text-slate-600">Select a class to mark attendance.</p>
            ) : rosterQuery.isLoading ? (
              <Skeleton className="h-48" />
            ) : rosterQuery.isError || !rosterQuery.data ? (
              <ErrorState message="We couldn't load the class roster." onRetry={() => rosterQuery.refetch()} />
            ) : (
              <>
                <h2 className="text-lg font-semibold text-brand">{rosterQuery.data.cohortName}</h2>
                <ul className="mt-4 space-y-2">
                  {rosterQuery.data.roster.map((r) => (
                    <li
                      key={r.userId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-slate-800">{r.name}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                            statusTone[r.status] ?? statusTone.excused
                          }`}
                        >
                          {r.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => mark(r.userId, rosterQuery.data.meetingId, 'present')}
                          disabled={markMutation.isPending}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => mark(r.userId, rosterQuery.data.meetingId, 'absent')}
                          disabled={markMutation.isPending}
                          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
                        >
                          Absent
                        </button>
                      </div>
                    </li>
                  ))}
                  {rosterQuery.data.roster.length === 0 ? (
                    <li className="text-sm text-slate-600">No trainees enrolled in this cohort.</li>
                  ) : null}
                </ul>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default TrainingTeachingPage
