import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import TrainingRollup from './TrainingRollup'
import type { RollupSession, RollupTrainee } from '../../../features/training/types'

const trainees: RollupTrainee[] = [
  {
    id: 1,
    name: 'Ada Obi',
    email: 'ada@example.com',
    cohortId: 2,
    cohortName: '2026',
    track: 'new',
    missed: 1,
    maxMissedClasses: 3,
    graduation: 'on_track',
    enrollmentStatus: 'enrolled',
  },
]

const sessions: RollupSession[] = [
  {
    id: 3,
    cohortId: 1,
    cohortName: '2026',
    week: 4,
    topic: 'Evangelism',
    teacher: 'Grace',
    date: '2026-01-12T00:00:00.000Z',
    startTime: '7:10 AM',
    endTime: '8:10 AM',
    location: 'Hall A',
    status: 'Completed',
  },
  {
    id: 4,
    cohortId: 1,
    cohortName: '2026',
    week: 5,
    topic: 'Prayer',
    teacher: 'Grace',
    date: '2026-06-12T00:00:00.000Z',
    startTime: '7:10 AM',
    endTime: '8:10 AM',
    location: 'Hall A',
    status: 'Upcoming',
  },
]

describe('TrainingRollup', () => {
  test('defaults to the trainees view', () => {
    render(<TrainingRollup trainees={trainees} sessions={sessions} />)
    expect(screen.getByText('Ada Obi')).toBeTruthy()
  })

  test('switches to sessions and filters by status', () => {
    render(<TrainingRollup trainees={trainees} sessions={sessions} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sessions' }))
    expect(screen.getByText(/Evangelism/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Upcoming' }))
    expect(screen.queryByText(/Evangelism/)).toBeNull()
    expect(screen.getByText(/Prayer/)).toBeTruthy()
  })

  test('shows the error state', () => {
    render(<TrainingRollup trainees={[]} sessions={[]} errorMessage="Nope" />)
    expect(screen.getByText('Nope')).toBeTruthy()
  })

  test('shows the all-sessions empty message in the sessions view', () => {
    render(<TrainingRollup trainees={trainees} sessions={[]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sessions' }))
    expect(screen.getByText('No sessions found for all.')).toBeTruthy()
  })
})
