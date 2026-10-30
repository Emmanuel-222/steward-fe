import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { LOGIN_PATH } from '../../../app/router/paths'
import { NAV } from '../../../features/landing/content'

function LandingNav() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="font-serif text-xl font-semibold tracking-tight text-ink"
        >
          {NAV.brand}
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="rounded-control bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-hover"
            >
              {NAV.dashboard}
            </Link>
          ) : (
            <>
              <Link
                to={LOGIN_PATH}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-slate transition hover:text-ink"
              >
                {NAV.signIn}
              </Link>
              <Link
                to="/signup"
                className="rounded-control bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-hover"
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
