import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../../pages/HomePage'
import LoginPage from '../../pages/LoginPage'
import NotFoundPage from '../../pages/NotFoundPage'
import AttendancePage from '../../pages/AttendancePage'
import MeetingsPage from '../../pages/MeetingsPage'
import StewardsPage from '../../pages/StewardsPage'
import StewardDetailPage from '../../pages/StewardDetailPage'
import MyExcusesPage from '../../pages/MyExcusesPage'
import ExcuseRequestsPage from '../../pages/ExcuseRequestsPage'
import CheckInPage from '../../pages/CheckInPage'
import OnboardingPage from '../../pages/OnboardingPage'
import SignupPage from '../../pages/SignupPage'
import VerifyEmailPage from '../../pages/VerifyEmailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/verify-email/:token',
    element: <VerifyEmailPage />,
  },
  {
    path: '/check-in/:token',
    element: <CheckInPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/dashboard',
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'stewards',
        element: <StewardsPage />,
      },
      {
        path: 'stewards/:id',
        element: <StewardDetailPage />,
      },
      {
        path: 'meetings',
        element: <MeetingsPage />,
      },
      {
        path: 'attendance/:meetingId?',
        element: <AttendancePage />,
      },
      {
        path: 'my-excuses',
        element: <MyExcusesPage />,
      },
      {
        path: 'excuse-requests',
        element: <ExcuseRequestsPage />,
      },
    ],
  },
])
