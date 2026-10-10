import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import TrainingTraineesTable from './TrainingTraineesTable'
import type { RollupTrainee } from '../../../features/training/types'

const rows: RollupTrainee[] = [
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

describe('TrainingTraineesTable', () => {
  test('renders a trainee row', () => {
    render(<TrainingTraineesTable trainees={rows} />)
    expect(screen.getByText('Ada Obi')).toBeTruthy()
    expect(screen.getByText('ada@example.com')).toBeTruthy()
  })

  test('hides the cohort column by default and shows it when asked', () => {
    const { rerender } = render(<TrainingTraineesTable trainees={rows} />)
    expect(screen.queryByText('Cohort')).toBeNull()
    rerender(<TrainingTraineesTable trainees={rows} showCohort />)
    expect(screen.getByText('2026')).toBeTruthy()
  })

  test('renders the Graduate action only when onGraduate is provided', () => {
    const { rerender } = render(<TrainingTraineesTable trainees={rows} />)
    expect(screen.queryByText('Graduate')).toBeNull()
    rerender(<TrainingTraineesTable trainees={rows} onGraduate={() => {}} />)
    expect(screen.getByText('Graduate')).toBeTruthy()
  })

  test('shows the empty state', () => {
    render(<TrainingTraineesTable trainees={[]} />)
    expect(screen.getByText('No trainees yet.')).toBeTruthy()
  })
})
