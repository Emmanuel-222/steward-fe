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

  test('cohort scope shows training columns; global scope shows identity columns', () => {
    const { rerender } = render(<TrainingTraineesTable trainees={rows} />)
    expect(screen.getByText('Track')).toBeTruthy()
    expect(screen.queryByText('Cohort')).toBeNull()

    rerender(<TrainingTraineesTable trainees={rows} scope="global" />)
    expect(screen.getByText('Cohort')).toBeTruthy()
    expect(screen.getByText('Department')).toBeTruthy()
    expect(screen.queryByText('Track')).toBeNull()
  })

  test('global scope shows Unassigned when no department is set', () => {
    render(<TrainingTraineesTable trainees={rows} scope="global" />)
    expect(screen.getByText('Unassigned')).toBeTruthy()
  })

  test('renders the Graduate action only when onGraduate is provided', () => {
    const { rerender } = render(<TrainingTraineesTable trainees={rows} />)
    expect(screen.queryByText('Graduate')).toBeNull()
    rerender(<TrainingTraineesTable trainees={rows} onGraduate={() => {}} />)
    expect(screen.getByText('Graduate')).toBeTruthy()
  })

  test('shows the status text and no Graduate button for a non-enrolled trainee', () => {
    render(
      <TrainingTraineesTable
        trainees={[{ ...rows[0], enrollmentStatus: 'graduated' }]}
        onGraduate={() => {}}
      />,
    )
    expect(screen.getByText('graduated')).toBeTruthy()
    expect(screen.queryByText('Graduate')).toBeNull()
  })

  test('shows the empty state', () => {
    render(<TrainingTraineesTable trainees={[]} />)
    expect(screen.getByText('No trainees yet.')).toBeTruthy()
  })
})
