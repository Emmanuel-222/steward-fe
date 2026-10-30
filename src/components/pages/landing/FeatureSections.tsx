import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Calendar, FileText, Users } from 'lucide-react'
import { FEATURES, STEPS, RUSH_POINTS, GET_STARTED } from '../../../features/landing/content'

const ICONS: Record<string, typeof BookOpen> = {
  'Steward registry': BookOpen,
  'Meetings & attendance': Calendar,
  'Excuse requests': FileText,
  'Workers-in-Training': Users,
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {children}
      </h2>
      <div className="mx-auto mt-8 h-1 w-20 bg-gold" />
    </div>
  )
}

type WhatItDoesProps = { className?: string; style?: React.CSSProperties }

export function WhatItDoes({ className, style }: WhatItDoesProps) {
  const PrimaryIcon = ICONS[FEATURES[0].title]

  return (
    <section className={`px-4 pb-24 sm:px-6 ${className ?? ''}`} style={style}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading>What it does</SectionHeading>

        <div className="mt-16">
          {/* Primary feature — prominent, full-width */}
          <article className="rounded-section border border-line bg-paper p-10 sm:p-14 shadow-card">
            <div className="grid gap-8 items-center sm:grid-cols-12">
              <div className="sm:col-span-4 flex items-center justify-center">
                <div className="rounded-3xl bg-gold/10 p-6 text-gold">
                  <PrimaryIcon className="h-8 w-8" />
                </div>
              </div>
              <div className="sm:col-span-8">
                <h3 className="text-lg font-bold text-ink">{FEATURES[0].title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-slate">
                  {FEATURES[0].body}
                </p>
              </div>
            </div>
          </article>

          {/* Supporting features — two-up grid, varied */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {FEATURES.slice(1).map((feature) => {
              const Icon = ICONS[feature.title]
              return (
                <article
                  key={feature.title}
                  className="rounded-xl border border-line bg-paper p-8 shadow-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-gold/10 p-3 text-gold shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-ink">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate">{feature.body}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

type HowItWorksProps = { className?: string; style?: React.CSSProperties }

export function HowItWorks({ className, style }: HowItWorksProps) {
  return (
    <section className={`bg-paper px-4 py-24 sm:px-6 ${className ?? ''}`} style={style}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading>How it works</SectionHeading>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.title} className="space-y-4">
              <h3 className="text-base font-bold text-ink">{step.title}</h3>
              <p className="text-lg leading-relaxed text-slate">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

type SundayRushProps = { className?: string; style?: React.CSSProperties }

export function SundayRush({ className, style }: SundayRushProps) {
  return (
    <section className={`bg-ink px-4 py-24 text-white sm:px-6 ${className ?? ''}`} style={style}>
      <div className="mx-auto max-w-5xl relative">
        <div className="text-center">
          <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for the Sunday rush.
          </h2>
          <div className="mx-auto mt-8 h-1 w-20 bg-gold" />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {RUSH_POINTS.map((point) => (
            <article key={point.title} className="relative p-8 rounded-xl border border-gold/20 bg-white/5">
              <h3 className="text-sm font-semibold text-gold">{point.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {point.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

type GetStartedBandProps = { className?: string; style?: React.CSSProperties }

export function GetStartedBand({ className, style }: GetStartedBandProps) {
  return (
    <section className={`px-4 py-24 sm:px-6 ${className ?? ''}`} style={style}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {GET_STARTED.title}
        </h2>
        <div className="mx-auto mt-8 h-1 w-20 bg-gold" />
        <p className="mt-10 text-lg leading-relaxed text-slate">
          {GET_STARTED.body}
        </p>
        <Link
          to="/signup"
          className="mt-14 inline-block rounded-control bg-gold px-7 py-3.5 text-sm font-bold text-ink transition hover:bg-gold-hover active:scale-95"
        >
          {GET_STARTED.cta}
        </Link>
      </div>
    </section>
  )
}
