import useAuth from '../hooks/useAuth'
import HomePage from './HomePage'
import TrainingHomePage from './TrainingHomePage'

function DashboardIndexPage() {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()

  if (role === 'trainee') {
    return <TrainingHomePage />
  }

  return <HomePage />
}

export default DashboardIndexPage
