import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import type { PropsWithChildren } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '16px', padding: '12px 20px', fontSize: '14px', fontWeight: 600 },
          success: { style: { background: '#22c55e', color: '#fff' } },
          error: { style: { background: '#ef4444', color: '#fff' } },
        }}
      />
    </QueryClientProvider>
  )
}

export default AppProviders
