import { Link } from 'react-router-dom'
import { LOGIN_PATH } from '../../../app/router/paths'
import { FOOTER, NAV } from '../../../features/landing/content'

function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
        <span className="font-serif text-lg font-semibold tracking-tight text-brand">
          {NAV.brand}
        </span>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to={LOGIN_PATH} className="transition hover:text-brand">
            {NAV.signIn}
          </Link>
          <Link to="/signup" className="transition hover:text-brand">
            {NAV.getStarted}
          </Link>
        </nav>

        <p className="text-xs text-slate-500">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}

export default LandingFooter
