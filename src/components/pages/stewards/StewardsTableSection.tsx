import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react'

export type Steward = {
  initials: string
  name: string
  email: string
  department: string
  role: string
  roleTone: string
  phone: string
  dateAdded: string
}

type StewardsTableSectionProps = {
  stewards: Steward[]
  onView: (steward: Steward) => void
  onEdit: (steward: Steward) => void
  onDelete: (steward: Steward) => void
}

function StewardsTableSection({
  stewards,
  onView,
  onEdit,
  onDelete,
}: StewardsTableSectionProps) {
  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
      <div className="hidden grid-cols-[2fr_1.3fr_1.1fr_1.1fr_1fr_0.8fr] gap-4 border-b border-slate-100 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 lg:grid">
        <p>Full Name</p>
        <p>Department</p>
        <p>Role</p>
        <p>Phone</p>
        <p>Date Added</p>
        <p>Actions</p>
      </div>

      <div className="divide-y divide-slate-100">
        {stewards.map((steward) => (
          <article
            key={steward.email}
            className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[2fr_1.3fr_1.1fr_1.1fr_1fr_0.8fr] lg:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfeafa] text-sm font-semibold text-[#0f2d52]">
                {steward.initials}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{steward.name}</p>
                <p className="break-all text-sm text-slate-500 sm:break-normal">
                  {steward.email}
                </p>
              </div>
            </div>

            <div>
              <span className="inline-flex rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-medium text-[#5471a8]">
                {steward.department}
              </span>
            </div>

            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${steward.roleTone}`}
              >
                {steward.role}
              </span>
            </div>

            <p className="text-sm text-slate-600">{steward.phone}</p>
            <p className="text-sm text-slate-600">{steward.dateAdded}</p>

            <div className="flex items-center gap-3 text-slate-500">
              <button
                type="button"
                onClick={() => onView(steward)}
                className="transition hover:text-[#0f2d52]"
                aria-label={`View ${steward.name}`}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onEdit(steward)}
                className="transition hover:text-[#0f2d52]"
                aria-label={`Edit ${steward.name}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(steward)}
                className="transition hover:text-rose-600"
                aria-label={`Delete ${steward.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-4 py-5 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <p>Showing 1 to 4 of 1,284 entries</p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:text-slate-700"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f2d52] text-sm font-semibold text-white"
          >
            1
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            2
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            3
          </button>
          <span className="px-2 text-slate-400">...</span>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            321
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-700"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default StewardsTableSection
