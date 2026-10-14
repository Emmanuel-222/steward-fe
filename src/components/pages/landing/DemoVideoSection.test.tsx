import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import DemoVideoSection from './DemoVideoSection'

describe('DemoVideoSection', () => {
  test('renders a play control and no broken video element', () => {
    const { container } = render(<DemoVideoSection />)
    expect(screen.getByRole('button', { name: /play the demo/i })).toBeTruthy()
    expect(container.querySelector('video')).toBeNull()
  })

  test('the section is the #demo anchor target', () => {
    const { container } = render(<DemoVideoSection />)
    expect(container.querySelector('#demo')).toBeTruthy()
  })
})
