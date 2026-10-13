import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from './routes'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('route table', () => {
  test('the root path shows the landing page', async () => {
    renderAt('/')
    expect(
      await screen.findByRole('heading', { name: /every steward, accounted for/i }, { timeout: 5000 }),
    ).toBeTruthy()
  })

  test('the login path shows the login form', async () => {
    renderAt('/login')
    expect(
      await screen.findByRole('heading', { name: /welcome back/i }, { timeout: 5000 }),
    ).toBeTruthy()
  })

  test('an unauthenticated visit to /dashboard lands on the login form', async () => {
    renderAt('/dashboard')
    expect(
      await screen.findByRole('heading', { name: /welcome back/i }, { timeout: 5000 }),
    ).toBeTruthy()
  })

  test('the login screen shows the inactivity notice after an idle sign-out', async () => {
    sessionStorage.setItem('steward:signedOutReason', 'idle')
    try {
      renderAt('/login')
      expect(
        await screen.findByText(
          /signed out after a period of inactivity/i,
          {},
          { timeout: 5000 },
        ),
      ).toBeTruthy()
    } finally {
      sessionStorage.clear()
    }
  })

  test('the forgot-password screen links back to /login', async () => {
    renderAt('/forgot-password')
    const link = await screen.findByRole('link', { name: /back to login/i }, { timeout: 5000 })
    expect(link.getAttribute('href')).toBe('/login')
  })
})
