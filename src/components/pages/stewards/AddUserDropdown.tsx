import { ChevronDown, FileUp, UserPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type AddUserDropdownProps = {
  onAddSingle: () => void
  onImportCsv: () => void
}

function AddUserDropdown({ onAddSingle, onImportCsv }: AddUserDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-brand-hover"
      >
        <UserPlus className="h-4 w-4" />
        Add New User
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
          <button
            type="button"
            onClick={() => { setOpen(false); onAddSingle() }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f3f7fd]"
          >
            <UserPlus className="h-4 w-4 text-brand" />
            Add Single User
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onImportCsv() }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f3f7fd]"
          >
            <FileUp className="h-4 w-4 text-brand" />
            Import from CSV
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default AddUserDropdown
