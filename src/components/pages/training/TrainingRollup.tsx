import { useState } from 'react'
import type { ReactNode } from 'react'
import MeetingsTabs from '../meetings/MeetingsTabs'
import MeetingCard from '../meetings/MeetingCard'
import TrainingTraineesTable from './TrainingTraineesTable'
import ErrorState from '../../ui/ErrorState'
import { SkeletonTable } from '../../ui/Skeleton'
import { sessionToMeeting } from '../../../features/training/sessionCard'
import type { RollupSession, RollupTrainee, SessionStatus } from '../../../features/training/types'

const VIEWS = ['Trainees', 'Sessions'] as const
const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed'] as const

type TrainingRollupProps = {
  trainees: RollupTrainee[]
  sessions: RollupSession[]
  isLoading?: boolean
  errorMessage?: string
  onRetry?: () => void
  onOpenCohort?: (cohortId: number) => void
  renderTraineeActions?: (trainee: RollupTrainee) => ReactNode
}

function TrainingRollup({
  trainees,
  sessions,
  isLoading = false,
  errorMessage,
  onRetry,
  onOpenCohort,
  renderTraineeActions,
}: TrainingRollupProps) {
  const [view, setView] = useState<(typeof VIEWS)[number]>('Trainees')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  const filteredSessions =
    filter === 'All' ? sessions : sessions.filter((s) => s.status === (filter as SessionStatus))

  return (
    <section className="space-y-4">
      <MeetingsTabs tabs={[...VIEWS]} activeTab={view} onTabChange={(t) => setView(t as typeof view)} />

      {view === 'Sessions' ? (
        <MeetingsTabs
          tabs={[...FILTERS]}
          activeTab={filter}
          onTabChange={(t) => setFilter(t as typeof filter)}
        />
      ) : null}

      {isLoading ? (
        <SkeletonTable rows={4} cols={view === 'Trainees' ? 6 : 3} />
      ) : errorMessage ? (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      ) : view === 'Trainees' ? (
        <TrainingTraineesTable trainees={trainees} scope="global" renderActions={renderTraineeActions} />
      ) : filteredSessions.length === 0 ? (
        <div className="rounded-card border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow-sm">
          No sessions found for {filter.toLowerCase()}.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredSessions.map((session) => (
            <MeetingCard
              key={`${session.cohortId}-${session.id}`}
              meeting={sessionToMeeting(session)}
              cohortName={session.cohortName}
              onAction={() => onOpenCohort?.(session.cohortId)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default TrainingRollup
