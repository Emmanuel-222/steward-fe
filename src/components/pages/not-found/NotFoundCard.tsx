import { Link } from 'react-router-dom'

function NotFoundCard() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        The route you tried to open does not exist yet.
      </p>
      <Link
        className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        to="/"
      >
        Return home
      </Link>
    </div>
  )
}

export default NotFoundCard
