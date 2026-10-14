import type { ReactElement } from 'react'
import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { WhatItDoes, HowItWorks, SundayRush, GetStartedBand } from './FeatureSections'

const wrap = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('feature sections', () => {
  test('what it does lists the four pillars', () => {
    wrap(<WhatItDoes />)
    for (const label of ['Steward registry', 'Meetings & attendance', 'Excuse requests', 'Workers-in-Training']) {
      expect(screen.getByText(label)).toBeTruthy()
    }
  })

  test('how it works shows the three steps in order', () => {
    wrap(<HowItWorks />)
    const steps = ['Add your people', 'Create a meeting', 'Mark and close']
    for (const step of steps) expect(screen.getByText(step)).toBeTruthy()
  })

  test('the get started band links to signup', () => {
    wrap(<GetStartedBand />)
    expect(screen.getByRole('link', { name: /get started/i }).getAttribute('href')).toBe('/signup')
  })

  test('the sunday rush section names the differentiators', () => {
    wrap(<SundayRush />)
    expect(screen.getByText(/seconds per person/i)).toBeTruthy()
    expect(screen.getByText(/qr check-in/i)).toBeTruthy()
    expect(screen.getByText(/no one slips through/i)).toBeTruthy()
  })
})
