import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../../pages/HomePage'
import LoginPage from '../../pages/LoginPage'
import NotFoundPage from '../../pages/NotFoundPage'
import AttendancePage from '../../pages/AttendancePage'
import MeetingsPage from '../../pages/MeetingsPage'
import StewardsPage from '../../pages/StewardsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
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
        path: 'meetings',
        element: <MeetingsPage />,
      },
      {
        path: 'attendance',
        element: <AttendancePage />,
      },
    ],
  },
])
