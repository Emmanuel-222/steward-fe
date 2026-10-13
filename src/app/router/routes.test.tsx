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
})
