import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

type QuickAction = {
  label: string
  icon: LucideIcon
  emphasized?: boolean
  onClick?: () => void
}

type RegistryActionsSectionProps = {
  actions: QuickAction[]
}

function RegistryActionsSection({ actions }: RegistryActionsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-brand">Registry Actions</h3>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={[
                'flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition',
                action.emphasized
                  ? 'border-brand bg-brand text-white shadow-[0_18px_40px_rgba(15,45,82,0.25)]'
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
    </div>
  )
}

export default RegistryActionsSection


