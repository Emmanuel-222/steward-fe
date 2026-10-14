import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FEATURES, STEPS, RUSH_POINTS, GET_STARTED } from '../../../features/landing/content'

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-brand">{children}</h2>
      <div className="mx-auto mt-5 h-0.5 w-9 bg-signature" />
    </div>
  )
}

export function WhatItDoes() {
  return (
    <section className="px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>What it does</SectionHeading>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="border-t-2 border-signature pt-4">
              <h3 className="text-sm font-bold text-brand">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>How it works</SectionHeading>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title}>
              <span className="font-serif text-2xl font-semibold text-signature">{index + 1}</span>
              <h3 className="mt-3 text-sm font-bold text-brand">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SundayRush() {
  return (
    <section className="bg-brand px-4 py-20 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">Built for the Sunday rush.</h2>
          <div className="mx-auto mt-5 h-0.5 w-9 bg-signature" />
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {RUSH_POINTS.map((point) => (
            <div key={point.title}>
              <h3 className="text-sm font-bold">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function GetStartedBand() {
  return (
    <section className="bg-brand px-4 py-20 text-center text-white sm:px-6">
      <div className="mx-auto max-w-xl">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">{GET_STARTED.title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">{GET_STARTED.body}</p>
        <Link
          to="/signup"
          className="mt-8 inline-block rounded-xl bg-signature px-7 py-3.5 text-sm font-bold text-brand transition hover:brightness-95"
        >
          {GET_STARTED.cta}
        </Link>
      </div>
    </section>
  )
}
