import { lazy, Suspense } from 'react'
import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import RouteFallback from '../../components/ui/RouteFallback'

function page(importer: () => Promise<{ default: ComponentType }>) {
  const Component = lazy(importer)
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: page(() => import('../../pages/LoginPage')),
  },
  {
    path: '/signup',
    element: page(() => import('../../pages/SignupPage')),
  },
  {
    path: '/verify-email/:token',
    element: page(() => import('../../pages/VerifyEmailPage')),
  },
  {
    path: '/check-in/:token',
    element: page(() => import('../../pages/CheckInPage')),
  },
  {
    path: '/onboarding',
    element: page(() => import('../../pages/OnboardingPage')),
  },
  {
    path: '/forgot-password',
    element: page(() => import('../../pages/ForgotPasswordPage')),
  },
  {
    path: '/reset-password',
    element: page(() => import('../../pages/ResetPasswordPage')),
  },
  {
    path: '/dashboard',
    element: <MainLayout />,
    errorElement: page(() => import('../../pages/NotFoundPage')),
    children: [
      {
        index: true,
        element: page(() => import('../../pages/HomePage')),
      },
      {
        path: 'stewards',
        element: page(() => import('../../pages/StewardsPage')),
      },
      {
        path: 'stewards/:id',
        element: page(() => import('../../pages/StewardDetailPage')),
      },
      {
        path: 'meetings',
        element: page(() => import('../../pages/MeetingsPage')),
      },
      {
        path: 'attendance/:meetingId?',
        element: page(() => import('../../pages/AttendancePage')),
      },
      {
        path: 'my-excuses',
        element: page(() => import('../../pages/MyExcusesPage')),
      },
      {
        path: 'excuse-requests',
        element: page(() => import('../../pages/ExcuseRequestsPage')),
      },
      {
        path: 'profile',
        element: page(() => import('../../pages/ProfilePage')),
      },
    ],
  },
])
