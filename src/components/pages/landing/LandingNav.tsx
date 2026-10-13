import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { LOGIN_PATH } from '../../../app/router/paths'
import { NAV } from '../../../features/landing/content'

function LandingNav() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <span className="font-serif text-xl font-semibold tracking-tight text-brand">
          {NAV.brand}
        </span>

        <nav className="flex items-center gap-3 sm:gap-5">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              {NAV.dashboard}
            </Link>
          ) : (
            <>
              <Link
                to={LOGIN_PATH}
                className="text-sm font-semibold text-slate-600 transition hover:text-brand"
              >
                {NAV.signIn}
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                {NAV.getStarted}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default LandingNav
