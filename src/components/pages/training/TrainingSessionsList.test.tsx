import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import TrainingSessionsList from './TrainingSessionsList'
import type { RollupSession } from '../../../features/training/types'

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
    status: 'Ongoing',
  },
]

describe('TrainingSessionsList', () => {
  test('renders a session with its status badge', () => {
    render(<TrainingSessionsList sessions={sessions} />)
    expect(screen.getByText(/Evangelism/)).toBeTruthy()
    expect(screen.getByText('Ongoing')).toBeTruthy()
  })

  test('hides the cohort name by default', () => {
    render(<TrainingSessionsList sessions={sessions} />)
    expect(screen.queryByText(/2026 ·/)).toBeNull()
  })

  test('shows the cohort name when asked', () => {
    render(<TrainingSessionsList sessions={sessions} showCohort />)
    expect(screen.getByText(/2026 ·/)).toBeTruthy()
  })

  test('shows a custom empty message', () => {
    render(<TrainingSessionsList sessions={[]} emptyMessage="No sessions found for ongoing." />)
    expect(screen.getByText('No sessions found for ongoing.')).toBeTruthy()
  })
})
