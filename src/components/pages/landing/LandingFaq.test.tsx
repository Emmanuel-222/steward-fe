import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import LandingFaq from './LandingFaq'

describe('LandingFaq', () => {
  test('renders each question and its answer', () => {
    render(<LandingFaq />)
    expect(screen.getByText('Do we need to install anything?')).toBeTruthy()
    expect(screen.getByText(/runs in the browser/i)).toBeTruthy()
    expect(screen.getByText('Can we import our existing records?')).toBeTruthy()
  })

  test('never states a trial length', () => {
    const { container } = render(<LandingFaq />)
    expect(container.textContent ?? '').not.toMatch(/free trial|\d+\s*days?\s*(free|trial)/i)
  })
})
