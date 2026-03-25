import type { LucideIcon } from 'lucide-react'
import { Check, ChevronDown } from 'lucide-react'
import SearchField from '../../shared/SearchField'

type AttendanceRow = {
  name: string
  email: string
  role: string
  status: string
  statusTone: string
  actionLabel: string
  actionTone: string
  accent: string
  secondaryIcon: LucideIcon | null
}

type AttendanceRegistrySectionProps = {
  filters: string[]
  rows: AttendanceRow[]
}

function AttendanceRegistrySection({
  filters,
  rows,
}: AttendanceRegistrySectionProps) {
  return (
    <section className="space-y-5 rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                index === 0
                  ? 'bg-[#0f2d52] text-white'
                  : 'bg-[#f4f7fb] text-slate-500 hover:bg-slate-100 hover:text-slate-700',
              ].join(' ')}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField placeholder="Search stewards..." />

          <button
            type="button"
            className="inline-flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600"
          >
            <span>Sort by: Check-in Time</span>
            <ChevronDown className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="hidden grid-cols-[2.2fr_1fr_1fr_1.3fr] gap-4 px-4 pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 lg:grid">
          <p>Steward Information</p>
          <p>Role</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        {rows.map((row, index) => {
          const SecondaryIcon = row.secondaryIcon

          return (
            <article
              key={row.email}
              className={`grid gap-4 rounded-3xl border ${row.accent} bg-[#fcfdff] p-4 shadow-sm lg:grid-cols-[2.2fr_1fr_1fr_1.3fr] lg:items-center`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d52] text-sm font-semibold text-white">
                  {row.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{row.name}</p>
                  <p className="break-all text-sm text-slate-500 sm:break-normal">
                    {row.email}
                  </p>
                </div>
              </div>

              <div>
                <span className="inline-flex rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-medium text-[#5471a8]">
                  {row.role}
                </span>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.statusTone}`}
                >
                  {row.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${row.actionTone}`}
                >
                  {index === 0 ? <Check className="h-4 w-4" /> : null}
                  {row.actionLabel}
                </button>

                {SecondaryIcon ? (
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
                  >
                    <SecondaryIcon className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default AttendanceRegistrySection
