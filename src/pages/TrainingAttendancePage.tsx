import { useState } from 'react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import ErrorState from '../components/ui/ErrorState'
import Spinner from '../components/ui/Spinner'
import GraduationStatusBadge from '../components/pages/training/GraduationStatusBadge'
import ExcuseRequestModal from '../components/pages/attendance/ExcuseRequestModal'
import { useTrainingClassesQuery, useTrainingMeQuery } from '../features/training/hooks/useTraining'

function TrainingAttendancePage() {
  const classesQuery = useTrainingClassesQuery()
  const meQuery = useTrainingMeQuery()
  const [excuseFor, setExcuseFor] = useState<{ meetingId: number; label: string } | null>(null)

  const classes = classesQuery.data ?? []
  const missed = classes.filter((c) => c.required && c.status === 'Absent')

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="My Attendance"
        description="Classes you've missed, and permission for a class you can't attend."
      />

      {meQuery.data ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            You've missed <span className="font-semibold text-brand">{meQuery.data.missed}</span> of{' '}
            <span className="font-semibold text-brand">{meQuery.data.cohort.maxMissedClasses}</span>{' '}
            allowed classes.
          </p>
          <GraduationStatusBadge status={meQuery.data.graduation} />
        </div>
      ) : null}

      {classesQuery.isLoading ? (
        <Spinner />
      ) : classesQuery.isError ? (
        <ErrorState message="We couldn't load your attendance." onRetry={() => classesQuery.refetch()} />
      ) : missed.length === 0 ? (
        <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
          You haven't missed any class. Keep it up.
        </div>
      ) : (
        <ul className="space-y-3">
          {missed.map((c) => (
            <li
              key={String(c.id)}
              className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-rose-100 bg-rose-50/40 p-4"
            >
              <div>
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
                </p>
              </div>
              <button
                type="button"
                disabled={c.meetingId == null}
                onClick={() =>
                  c.meetingId != null &&
                  setExcuseFor({
                    meetingId: c.meetingId,
                    label: c.topic ? `Week ${c.week} session` : 'Training session',
                  })
                }
                className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-brand ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Request permission
              </button>
            </li>
          ))}
        </ul>
      )}

      <ExcuseRequestModal
        meetingId={excuseFor ? String(excuseFor.meetingId) : ''}
        meetingTitle={excuseFor?.label ?? ''}
        isOpen={Boolean(excuseFor)}
        onClose={() => setExcuseFor(null)}
      />
    </div>
  )
}

export default TrainingAttendancePage
