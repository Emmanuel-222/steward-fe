import type { LucideIcon } from 'lucide-react'
import { ArrowRight, Download } from 'lucide-react'

type QuickAction = {
  label: string
  icon: LucideIcon
  emphasized?: boolean
}

type RegistryActionsSectionProps = {
  actions: QuickAction[]
}

function RegistryActionsSection({ actions }: RegistryActionsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#0f2d52]">Registry Actions</h3>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.label}
              type="button"
              className={[
                'flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition',
                action.emphasized
                  ? 'border-[#0f2d52] bg-[#0f2d52] text-white shadow-[0_18px_40px_rgba(15,45,82,0.25)]'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className="flex items-center gap-3 font-semibold">
                <Icon className="h-5 w-5" />
                {action.label}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )
        })}
      </div>

      <article className="rounded-[28px] bg-[#0f2d52] p-6 text-white shadow-[0_18px_45px_rgba(15,45,82,0.22)]">
        <h4 className="text-lg font-semibold">Registry Health</h4>
        <p className="mt-3 text-sm leading-6 text-slate-200">
          Total engagement is up 4.5% this month. Weekly reports are ready for
          export.
        </p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#0f2d52] transition hover:bg-emerald-300"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </article>
    </div>
  )
}

export default RegistryActionsSection
