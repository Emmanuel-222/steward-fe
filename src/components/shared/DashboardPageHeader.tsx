import type { PropsWithChildren, ReactNode } from 'react'

type DashboardPageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PropsWithChildren<DashboardPageHeaderProps>) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold tracking-tight text-[#0f2d52] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div> : null}
    </section>
  )
}

export default DashboardPageHeader
