import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingNav from './LandingNav'
import { clearAccessToken, setAccessToken } from '../../../services/tokenStore'

function makeSessionToken() {
  const payload = btoa(JSON.stringify({ exp: Math.floor((Date.now() + 60_000) / 1000) }))
  return `header.${payload}.signature`
}

function renderNav() {
  return render(
    <MemoryRouter>
      <LandingNav />
    </MemoryRouter>,
  )
}

describe('LandingNav', () => {
  test('signed-out visitors see Sign in and Get started', () => {
    clearAccessToken()
    localStorage.clear()
    renderNav()
    expect(screen.getByRole('link', { name: /sign in/i }).getAttribute('href')).toBe('/login')
    expect(screen.getByRole('link', { name: /get started/i }).getAttribute('href')).toBe('/signup')
  })

  test('signed-in visitors see a Dashboard link instead', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'admin' }))
    setAccessToken(makeSessionToken())
    renderNav()
    expect(screen.getByRole('link', { name: /dashboard/i }).getAttribute('href')).toBe('/dashboard')
    clearAccessToken()
    localStorage.clear()
  })
})
