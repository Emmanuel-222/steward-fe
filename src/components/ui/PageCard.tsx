import type { PropsWithChildren } from 'react'

type PageCardProps = PropsWithChildren<{
  title: string
  description: string
}>

function PageCard({ title, description, children }: PageCardProps) {
  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-300">
          {description}
        </p>
      </div>

      {children}
    </section>
  )
}

export default PageCard
