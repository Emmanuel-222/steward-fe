import { Check, Search, UserMinus, X } from 'lucide-react'
import { useState } from 'react'
import type { Steward } from '../../../features/stewards/types'
import { useAnimatedMount } from '../../../hooks/useAnimatedMount'
import { useDialogA11y } from '../../../hooks/useDialogA11y'

type AssignTeacherModalProps = {
  open: boolean
  title: string
  currentTeacherId: number | null
  stewards: Steward[]
  onClose: () => void
  onAssign: (teacherId: number | null) => Promise<void>
  isSubmitting: boolean
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function AssignTeacherModal({
  open,
  title,
  currentTeacherId,
  stewards,
  onClose,
  onAssign,
  isSubmitting,
}: AssignTeacherModalProps) {
  const { mounted, phase } = useAnimatedMount(open)
  const dialogRef = useDialogA11y<HTMLDivElement>(onClose)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number | null>(currentTeacherId)

  if (!mounted) return null

  const query = search.trim().toLowerCase()
  const filtered = stewards.filter((s) =>
    !query
      ? true
      : `${s.name} ${s.department} ${s.role}`.toLowerCase().includes(query),
  )

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-brand/40 backdrop-blur-sm ${phase === 'enter' ? 'animate-fade-in' : ''} ${phase === 'exit' ? 'animate-modal-exit' : ''}`}
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <div
          className={`flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col rounded-2xl bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-6 ${phase === 'enter' ? 'animate-modal-enter' : 'animate-modal-exit'}`}
          ref={dialogRef}
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-teacher-title"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 id="assign-teacher-title" className="text-xl font-semibold text-slate-900">
                Assign teacher
              </h3>
              <p className="mt-1 truncate text-sm text-slate-500">{title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-brand">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stewards by name, role or department"
              autoFocus
              className="w-full bg-transparent text-sm text-slate-800 outline-none"
            />
          </label>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-100">
            {filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">No stewards match that search.</p>
            ) : (
              <ul className="divide-y divide-slate-50">
                {filtered.map((s) => {
                  const id = Number(s.id)
                  const isSelected = selected === id
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(id)}
                        className={`flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-slate-50 ${isSelected ? 'bg-[#f4f8ff]' : ''}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#dfeafa] text-xs font-semibold text-brand">
                          {initials(s.name)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-800">{s.name}</span>
                          <span className="block truncate text-xs text-slate-500">
                            {s.department} · {s.role}
                          </span>
                        </span>
                        {isSelected ? <Check className="h-4 w-4 shrink-0 text-brand" /> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {currentTeacherId != null || selected != null ? (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <UserMinus className="h-3.5 w-3.5" /> Clear teacher
            </button>
          ) : null}

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#eef3ff] px-4 py-2.5 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onAssign(selected)}
              disabled={isSubmitting}
              className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover active:scale-[0.97] disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save teacher'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignTeacherModal
