import { Link } from 'react-router-dom'
import { HERO } from '../../../features/landing/content'

type LandingHeroProps = { className?: string; style?: React.CSSProperties }

function LandingHero({ className, style }: LandingHeroProps) {
  return (
    <section className={`relative px-4 pt-24 sm:px-6 sm:pt-32 ${className ?? ''}`} style={style}>
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
          {HERO.title}
        </h1>

        <div className="mx-auto mt-8 h-1 w-20 bg-gold" />

        <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-slate">
          {HERO.subtitle}
        </p>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/signup"
            className="rounded-control bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-gold-hover active:scale-95 sm:px-8"
          >
            {HERO.primaryCta}
          </Link>
          <a
            href="#demo"
            className="rounded-control border border-ink px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-ink/5 active:scale-95 sm:px-8"
          >
            {HERO.secondaryCta}
          </a>
        </div>
      </div>

      <div className="absolute -top-32 -right-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
    </section>
  )
}

export default LandingHero
