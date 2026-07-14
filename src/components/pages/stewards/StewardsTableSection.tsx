import { EllipsisVertical, Eye, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Steward } from '../../../features/stewards/types'
import { SkeletonRow } from '../../ui/Skeleton'
import ErrorState from '../../ui/ErrorState'

import useAuth from '../../../hooks/useAuth'

type StewardsTableSectionProps = {
  stewards: Steward[]
  onView: (steward: Steward) => void
  onEdit: (steward: Steward) => void
  onDelete: (steward: Steward) => void
  isLoading?: boolean
  errorMessage?: string
  onRetry?: () => void
}

function ActionMenu({ steward, onView, onEdit, onDelete, isAdmin }: {
  steward: Steward
  onView: (s: Steward) => void
  onEdit: (s: Steward) => void
  onDelete: (s: Steward) => void
  isAdmin: boolean
}) {
  const [open, setOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleToggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUp(spaceBelow < 160)
    }
    setOpen((prev) => !prev)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#0f2d52]"
        aria-label="Actions"
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-10 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] sm:right-0 sm:top-full sm:bottom-auto sm:mb-0 sm:mt-1 ${openUp ? 'bottom-full mb-2' : 'top-full mt-1'}`}
        >
          <button
            type="button"
            onClick={() => { onView(steward); setOpen(false) }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Eye className="h-4 w-4 text-slate-400" />
            View Details
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => { onEdit(steward); setOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4 text-slate-400" />
                Edit Record
              </button>
              <button
                type="button"
                onClick={() => { onDelete(steward); setOpen(false) }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Record
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function StewardsTableSection({
  stewards,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  errorMessage,
  onRetry,
}: StewardsTableSectionProps) {
  const { user } = useAuth()
  const isAdmin = user?.role?.toLowerCase() === 'admin'
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
      <div className="overflow-x-auto">
        <div className="hidden min-w-[640px] grid-cols-[2fr_1.3fr_1.1fr_1.1fr_1fr_0.8fr] gap-4 border-b border-slate-100 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:grid">
          <p>Full Name</p>
          <p>Department</p>
          <p>Role</p>
          <p>Phone</p>
          <p>Date Added</p>
          <p>Actions</p>
        </div>

        {isLoading ? (
          <div className="divide-y divide-slate-100 sm:min-w-[640px]">
            <SkeletonRow cols={6} />
            <SkeletonRow cols={6} />
            <SkeletonRow cols={6} />
            <SkeletonRow cols={6} />
            <SkeletonRow cols={6} />
          </div>
        ) : errorMessage ? (
          <ErrorState message={errorMessage} onRetry={onRetry} />
        ) : stewards.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
            No stewards matched your current filters.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 sm:min-w-[640px]">
            {stewards.map((steward) => (
              <article
                key={steward.id}
                className="relative flex flex-col gap-3 px-4 py-5 sm:grid sm:px-6 sm:grid-cols-[2fr_1.3fr_1.1fr_1.1fr_1fr_0.8fr] sm:items-center sm:gap-4"
              >
                {/* ---- Mobile layout ---- */}

                <div className="flex items-center gap-4 min-w-0 sm:hidden">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfeafa] text-sm font-semibold text-[#0f2d52]">
                    {steward.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">{steward.name}</p>
                    <p className="truncate text-sm text-slate-500">
                      {steward.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:hidden">
                  <span className="inline-flex rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-medium text-[#5471a8]">
                    {steward.department}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${steward.roleTone}`}
                  >
                    {steward.role}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 sm:hidden">
                  <span>{steward.phone}</span>
                  <span className="text-slate-300">·</span>
                  <span>{steward.dateAdded}</span>
                </div>

                {/* ---- Desktop layout ---- */}

                <div className="hidden sm:flex sm:items-center sm:gap-4 sm:min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfeafa] text-sm font-semibold text-[#0f2d52]">
                    {steward.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{steward.name}</p>
                    <p className="truncate text-sm text-slate-500">
                      {steward.email}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <span className="inline-flex rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-medium text-[#5471a8]">
                    {steward.department}
                  </span>
                </div>

                <div className="hidden sm:block">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${steward.roleTone}`}
                  >
                    {steward.role}
                  </span>
                </div>

                <p className="hidden sm:block sm:text-sm sm:text-slate-600">{steward.phone}</p>
                <p className="hidden sm:block sm:text-sm sm:text-slate-600">{steward.dateAdded}</p>

                {/* ActionMenu - absolute on mobile, grid on desktop */}
                <div className="absolute right-4 top-4 sm:static sm:col-start-6">
                  <ActionMenu
                    steward={steward}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isAdmin={isAdmin}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-4 py-5 text-sm text-slate-500 sm:px-6">
        <p>
          {stewards.length === 0
            ? 'No entries to display'
            : `Showing all ${stewards.length} entr${stewards.length === 1 ? 'y' : 'ies'}`}
        </p>
      </div>
    </section>
  )
}

export default StewardsTableSection
