import { Link } from 'react-router-dom'
import { LOGIN_PATH } from '../../../app/router/paths'
import { FOOTER, NAV } from '../../../features/landing/content'

const linkClass = 'inline-flex min-h-11 items-center transition hover:text-brand'

function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-10 sm:flex-row sm:px-6">
        <span className="font-serif text-lg font-semibold tracking-tight text-brand">
          {NAV.brand}
        </span>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 text-sm font-medium text-slate-600">
          <Link to={LOGIN_PATH} className={linkClass}>
            {NAV.signIn}
          </Link>
          <Link to="/signup" className={linkClass}>
            {NAV.getStarted}
          </Link>
          <a href={`mailto:${FOOTER.privacyEmail}`} className={linkClass}>
            {FOOTER.privacy}
          </a>
          <a href={`mailto:${FOOTER.privacyEmail}`} className={linkClass}>
            {FOOTER.contact}
          </a>
        </nav>

        <p className="text-xs text-slate-500">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}

export default LandingFooter
