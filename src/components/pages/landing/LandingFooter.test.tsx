import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingFooter from './LandingFooter'

function renderFooter() {
  return render(
    <MemoryRouter>
      <LandingFooter />
    </MemoryRouter>,
  )
}

describe('LandingFooter', () => {
  test('offers a privacy and a contact link', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: /privacy/i }).getAttribute('href')).toBe(
      'mailto:privacy@stewardattendance.com',
    )
    expect(screen.getByRole('link', { name: /contact/i }).getAttribute('href')).toBe(
      'mailto:privacy@stewardattendance.com',
    )
  })

  test('links to login and signup', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: /sign in/i }).getAttribute('href')).toBe('/login')
    expect(screen.getByRole('link', { name: /get started/i }).getAttribute('href')).toBe('/signup')
  })
})
