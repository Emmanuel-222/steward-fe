import { describe, expect, test } from 'vitest'
import { graduationLabel } from './api'

describe('graduationLabel', () => {
  test('maps on_track to affirming copy', () => {
    expect(graduationLabel('on_track')).toContain('On track')
  })

  test('maps at_risk to a warning', () => {
    expect(graduationLabel('at_risk')).toContain('At risk')
  })

  test('maps will_not_graduate to a failure warning', () => {
    expect(graduationLabel('will_not_graduate')).toContain('will not graduate')
  })
})
