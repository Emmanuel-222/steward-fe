import { Link } from 'react-router-dom'
import { LOGIN_PATH } from '../../../app/router/paths'
import { FOOTER, NAV } from '../../../features/landing/content'

const linkClass = 'inline-flex min-h-11 items-center transition hover:text-ink'

type LandingFooterProps = { className?: string; style?: React.CSSProperties }

function LandingFooter({ className, style }: LandingFooterProps) {
  return (
    <footer className={`border-t border-line bg-paper ${className ?? ''}`} style={style}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 py-12 sm:flex-row sm:px-6">
        <Link
          to="/"
          className="font-serif text-lg font-semibold tracking-tight text-ink"
        >
          {NAV.brand}
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-8 text-sm font-medium text-slate">
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

        <p className="text-xs text-slate">{FOOTER.copyright}</p>
      </div>
    </footer>
  )
}

export default LandingFooter
