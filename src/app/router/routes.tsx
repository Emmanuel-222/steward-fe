import { lazy, Suspense } from 'react'
import type { ComponentType } from 'react'
import type { RouteObject } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import RouteFallback from '../../components/ui/RouteFallback'
import RoleGuard from './RoleGuard'
import { LOGIN_PATH } from './paths'

function page(importer: () => Promise<{ default: ComponentType }>) {
  const Component = lazy(importer)
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  )
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: page(() => import('../../pages/LandingPage')),
  },
  {
    path: LOGIN_PATH,
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
        element: page(() => import('../../pages/DashboardIndexPage')),
      },
      {
        path: 'stewards',
        element: <RoleGuard allow={['admin', 'leader', 'pastor']}>{page(() => import('../../pages/StewardsPage'))}</RoleGuard>,
      },
      {
        path: 'stewards/:id',
        element: <RoleGuard allow={['admin', 'leader', 'pastor']}>{page(() => import('../../pages/StewardDetailPage'))}</RoleGuard>,
      },
      {
        path: 'meetings',
        element: <RoleGuard allow={['admin', 'leader']}>{page(() => import('../../pages/MeetingsPage'))}</RoleGuard>,
      },
      {
        path: 'attendance/:meetingId?',
        element: <RoleGuard allow={['admin', 'leader', 'pastor', 'steward']}>{page(() => import('../../pages/AttendancePage'))}</RoleGuard>,
      },
      {
        path: 'my-excuses',
        element: <RoleGuard allow={['steward']}>{page(() => import('../../pages/MyExcusesPage'))}</RoleGuard>,
      },
      {
        path: 'excuse-requests',
        element: <RoleGuard allow={['admin', 'leader', 'pastor']}>{page(() => import('../../pages/ExcuseRequestsPage'))}</RoleGuard>,
      },
      {
        path: 'profile',
        element: page(() => import('../../pages/ProfilePage')),
      },
      {
        path: 'classes',
        element: <RoleGuard allow={['trainee']}>{page(() => import('../../pages/TrainingClassesPage'))}</RoleGuard>,
      },
      {
        path: 'training-attendance',
        element: <RoleGuard allow={['trainee']}>{page(() => import('../../pages/TrainingAttendancePage'))}</RoleGuard>,
      },
      {
        path: 'training',
        element: <RoleGuard allow={['admin']}>{page(() => import('../../pages/TrainingCohortsPage'))}</RoleGuard>,
      },
      {
        path: 'training/:id',
        element: <RoleGuard allow={['admin']}>{page(() => import('../../pages/TrainingCohortDetailPage'))}</RoleGuard>,
      },
      {
        path: 'teaching',
        element: <RoleGuard allow={['steward', 'leader', 'pastor']}>{page(() => import('../../pages/TrainingTeachingPage'))}</RoleGuard>,
      },
    ],
  },
]
