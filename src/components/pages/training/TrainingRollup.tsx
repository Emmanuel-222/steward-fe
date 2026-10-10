import { useState } from 'react'
import MeetingsTabs from '../meetings/MeetingsTabs'
import TrainingTraineesTable from './TrainingTraineesTable'
import TrainingSessionsList from './TrainingSessionsList'
import ErrorState from '../../ui/ErrorState'
import { SkeletonTable } from '../../ui/Skeleton'
import type { RollupSession, RollupTrainee, SessionStatus } from '../../../features/training/types'

const VIEWS = ['Trainees', 'Sessions'] as const
const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed'] as const

type TrainingRollupProps = {
  trainees: RollupTrainee[]
  sessions: RollupSession[]
  isLoading?: boolean
  errorMessage?: string
  onRetry?: () => void
}

function TrainingRollup({
  trainees,
  sessions,
  isLoading = false,
  errorMessage,
  onRetry,
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
        <SkeletonTable rows={4} cols={view === 'Trainees' ? 5 : 3} />
      ) : errorMessage ? (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      ) : view === 'Trainees' ? (
        <TrainingTraineesTable trainees={trainees} showCohort />
      ) : (
        <TrainingSessionsList
          sessions={filteredSessions}
          showCohort
          emptyMessage={`No sessions found for ${filter.toLowerCase()}.`}
        />
      )}
    </section>
  )
}

export default TrainingRollup
