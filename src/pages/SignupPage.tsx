import { Navigate } from 'react-router-dom'
import LoginShowcase from '../components/pages/login/LoginShowcase'
import SignupForm from '../features/auth/components/SignupForm'
import useAuth from '../hooks/useAuth'

function SignupPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,164,92,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(15,45,82,0.10),transparent_22%)]" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-card border border-slate-200 bg-white shadow-heavy lg:grid lg:grid-cols-[0.95fr_1.2fr] animate-stagger-fade">
        <LoginShowcase />

        <section className="flex items-center p-5 sm:p-8 lg:p-10">
          <div className="w-full">
            <SignupForm />
          </div>
        </section>
      </div>
    </div>
  )
}

export default SignupPage
