import { ChevronDown, FileUp, UserPlus } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type AddUserDropdownProps = {
  onAddSingle: () => void
  onImportCsv: () => void
}

const GAP = 8
const VIEWPORT_MARGIN = 8

function AddUserDropdown({ onAddSingle, onImportCsv }: AddUserDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open) return undefined
    const reposition = () => {
      const button = buttonRef.current
      const menu = menuRef.current
      if (!button || !menu) return
      const buttonRect = button.getBoundingClientRect()
      const menuWidth = menu.offsetWidth
      const menuHeight = menu.offsetHeight
      const fitsBelow = buttonRect.bottom + GAP + menuHeight <= window.innerHeight - VIEWPORT_MARGIN
      menu.style.top = `${fitsBelow
        ? buttonRect.bottom + GAP
        : Math.max(VIEWPORT_MARGIN, buttonRect.top - menuHeight - GAP)}px`
      menu.style.left = `${Math.min(
        Math.max(VIEWPORT_MARGIN, buttonRect.right - menuWidth),
        window.innerWidth - menuWidth - VIEWPORT_MARGIN,
      )}px`
    }
    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

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
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-brand-hover"
      >
        <UserPlus className="h-4 w-4" />
        Add New User
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-50 w-60 max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-[0_20px_60px_rgba(15,23,42,0.15)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => { setOpen(false); onAddSingle() }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f3f7fd]"
          >
            <UserPlus className="h-4 w-4 text-brand" />
            Add Single User
          </button>
          <button
            type="button"
            role="menuitem"
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