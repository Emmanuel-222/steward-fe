import { Navigate } from 'react-router-dom'
import LoginShowcase from '../components/pages/login/LoginShowcase'
import LoginStatusPill from '../components/pages/login/LoginStatusPill'
import LoginForm from '../features/auth/components/LoginForm'
import useAuth from '../hooks/useAuth'

function LoginPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.16),_transparent_22%)]" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.12)] lg:grid-cols-[0.95fr_1.2fr]">
        <LoginShowcase />

        <section className="flex items-center p-5 sm:p-8 lg:p-10">
          <div className="w-full">
            <LoginForm />
          </div>
        </section>
      </div>

      <LoginStatusPill />
    </div>
  )
}

export default LoginPage
