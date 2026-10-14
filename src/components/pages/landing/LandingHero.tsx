import { Link } from 'react-router-dom'
import { HERO } from '../../../features/landing/content'

function LandingHero() {
  return (
    <section className="px-4 pb-16 pt-20 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
          {HERO.eyebrow}
        </p>

        <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-brand sm:text-5xl">
          {HERO.title}
        </h1>

        <div className="mx-auto mt-6 h-0.5 w-11 bg-signature" />

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-slate-600">
          {HERO.subtitle}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/signup"
            className="w-full rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover sm:w-auto"
          >
            {HERO.primaryCta}
          </Link>
          <a
            href="#demo"
            className="w-full rounded-xl border border-brand px-6 py-3.5 text-sm font-semibold text-brand transition hover:bg-brand/5 sm:w-auto"
          >
            {HERO.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
