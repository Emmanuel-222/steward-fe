import { describe, expect, test } from 'vitest'
import {
  toRollupSessionsGlobal,
  toRollupTraineesCohort,
  toRollupTraineesGlobal,
} from './adapters'

describe('training adapters', () => {
  test('maps global trainee list items to roll-up rows', () => {
    const rows = toRollupTraineesGlobal([
      {
        userId: 7,
        name: 'Ada Obi',
        email: 'ada@example.com',
        department: 'security dept.',
        role: 'trainee',
        phone: '+2348012345678',
        createdAt: '2026-10-09T00:00:00.000Z',
        cohortId: 2,
        cohortName: '2026',
        track: 'new',
        status: 'enrolled',
        missed: 1,
        maxMissedClasses: 3,
        graduation: 'on_track',
      },
    ])
    expect(rows[0]).toMatchObject({
      id: 7,
      cohortName: '2026',
      enrollmentStatus: 'enrolled',
      department: 'Security Dept.',
      role: 'Trainee',
    })
  })

  test('falls back to Unassigned when the global trainee has no department', () => {
    const rows = toRollupTraineesGlobal([
      {
        userId: 8,
        name: 'No Dept',
        email: 'nodept@example.com',
        department: '',
        role: 'trainee',
        phone: '',
        createdAt: '2026-10-09T00:00:00.000Z',
        cohortId: 2,
        cohortName: '2026',
        track: 'new',
        status: 'enrolled',
        missed: 0,
        maxMissedClasses: 3,
        graduation: 'on_track',
      },
    ])
    expect(rows[0]).toMatchObject({ department: 'Unassigned', phone: 'N/A' })
  })

  test('stamps the cohort name onto scoped trainees', () => {
    const rows = toRollupTraineesCohort(
      [
        {
          userId: 9,
          name: 'Bola Ade',
          email: 'bola@example.com',
          track: 'refresher',
          enrollmentStatus: 'graduated',
          missed: 0,
          maxMissedClasses: 3,
          graduation: 'on_track',
        },
      ],
      5,
      '2026 Intake',
    )
    expect(rows[0]).toMatchObject({ id: 9, cohortId: 5, cohortName: '2026 Intake' })
  })

  test('maps global sessions and derives status', () => {
    const rows = toRollupSessionsGlobal([
      {
        classId: 3,
        cohortId: 1,
        cohortName: '2026',
        week: 4,
        topic: 'Evangelism',
        teacher: 'Grace',
        date: '2000-01-01T00:00:00.000Z',
        startTime: '7:10 AM',
        endTime: '8:10 AM',
        location: 'Hall A',
      },
    ])
    expect(rows[0]).toMatchObject({ id: 3, topic: 'Evangelism', status: 'Completed' })
  })
})
