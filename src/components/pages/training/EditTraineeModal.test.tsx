import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import EditTraineeModal from './EditTraineeModal'
import type { RollupTrainee } from '../../../features/training/types'

const trainee: RollupTrainee = {
  id: 1,
  name: 'Ada Obi',
  email: 'ada@example.com',
  cohortId: 2,
  cohortName: '2026',
  track: 'new',
  missed: 0,
  maxMissedClasses: 3,
  graduation: 'on_track',
  enrollmentStatus: 'enrolled',
  phone: '+2348012345678',
  birthday: '01/02/2000',
}

const noop = async () => {}

describe('EditTraineeModal', () => {
  test('prefills name and birthday from the trainee', async () => {
    const { rerender } = render(
      <EditTraineeModal trainee={trainee} open={false} onClose={() => {}} onSubmit={noop} isSubmitting={false} />,
    )
    rerender(
      <EditTraineeModal trainee={trainee} open onClose={() => {}} onSubmit={noop} isSubmitting={false} />,
    )
    expect(await screen.findByDisplayValue('Ada Obi')).toBeTruthy()
    expect(screen.getByDisplayValue('01/02/2000')).toBeTruthy()
  })

  test('shows immediately when it mounts already open (keyed remount)', async () => {
    render(<EditTraineeModal trainee={trainee} open onClose={() => {}} onSubmit={noop} isSubmitting={false} />)
    expect(await screen.findByDisplayValue('Ada Obi')).toBeTruthy()
  })

  test('blocks submit when the phone is cleared', async () => {
    const onSubmit = vi.fn(noop)
    const { rerender } = render(
      <EditTraineeModal trainee={trainee} open={false} onClose={() => {}} onSubmit={onSubmit} isSubmitting={false} />,
    )
    rerender(
      <EditTraineeModal trainee={trainee} open onClose={() => {}} onSubmit={onSubmit} isSubmitting={false} />,
    )
    fireEvent.change(await screen.findByPlaceholderText('801 234 5678'), { target: { value: '' } })
    fireEvent.click(screen.getByText('Save changes'))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
