import { useState } from 'react'
import type { ReactNode } from 'react'
import MeetingsTabs from '../meetings/MeetingsTabs'
import MeetingCard from '../meetings/MeetingCard'
import TrainingTraineesTable from './TrainingTraineesTable'
import ErrorState from '../../ui/ErrorState'
import Pagination from '../../ui/Pagination'
import { SkeletonTable } from '../../ui/Skeleton'
import { sessionToMeeting } from '../../../features/training/sessionCard'
import type { RollupSession, RollupTrainee, SessionStatus } from '../../../features/training/types'

const VIEWS = ['Trainees', 'Sessions'] as const
const FILTERS = ['All', 'Upcoming', 'Ongoing', 'Completed'] as const
const SESSION_PAGE_SIZE = 6

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
  const [page, setPage] = useState(1)

  const filteredSessions =
    filter === 'All' ? sessions : sessions.filter((s) => s.status === (filter as SessionStatus))

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / SESSION_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedSessions = filteredSessions.slice(
    (safePage - 1) * SESSION_PAGE_SIZE,
    safePage * SESSION_PAGE_SIZE,
  )

  return (
    <section className="space-y-4">
      <MeetingsTabs
        tabs={[...VIEWS]}
        activeTab={view}
        onTabChange={(t) => {
          setView(t as typeof view)
          setPage(1)
        }}
      />

      {view === 'Sessions' ? (
        <MeetingsTabs
          tabs={[...FILTERS]}
          activeTab={filter}
          onTabChange={(t) => {
            setFilter(t as typeof filter)
            setPage(1)
          }}
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
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {pagedSessions.map((session) => (
              <MeetingCard
                key={`${session.cohortId}-${session.id}`}
                meeting={sessionToMeeting(session)}
                cohortName={session.cohortName}
                onAction={() => onOpenCohort?.(session.cohortId)}
              />
            ))}
          </div>
          {filteredSessions.length > SESSION_PAGE_SIZE ? (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              total={filteredSessions.length}
              pageSize={SESSION_PAGE_SIZE}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      )}
    </section>
  )
}

export default TrainingRollup
