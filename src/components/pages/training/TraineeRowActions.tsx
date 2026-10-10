import { EllipsisVertical, Eye, GraduationCap, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { RollupTrainee } from '../../../features/training/types'

type TraineeRowActionsProps = {
  trainee: RollupTrainee
  onView: (trainee: RollupTrainee) => void
  onEdit: (trainee: RollupTrainee) => void
  onGraduate: (trainee: RollupTrainee) => void
  onDelete: (trainee: RollupTrainee) => void
}

const ITEM_HEIGHT = 44

function TraineeRowActions({ trainee, onView, onEdit, onGraduate, onDelete }: TraineeRowActionsProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const canGraduate = trainee.enrollmentStatus === 'enrolled'

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    const close = () => setOpen(false)
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const handleToggle = () => {
    if (open) {
      setOpen(false)
      return
    }
    const btn = buttonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const itemCount = canGraduate ? 4 : 3
    const menuHeight = itemCount * ITEM_HEIGHT + 8
    const openUp = window.innerHeight - rect.bottom < menuHeight + 12
    setCoords({
      top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6,
      right: Math.max(8, window.innerWidth - rect.right),
    })
    setOpen(true)
  }

  const run = (fn: (t: RollupTrainee) => void) => {
    fn(trainee)
    setOpen(false)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-brand"
        aria-label={`Actions for ${trainee.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <EllipsisVertical className="h-4 w-4" />
      </button>

      {open && coords
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ top: coords.top, right: coords.right }}
              className="fixed z-[100] w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)] animate-slide-down"
            >
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onView)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Eye className="h-4 w-4 text-slate-600" />
                View Details
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onEdit)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4 text-slate-600" />
                Edit Record
              </button>
              {canGraduate ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => run(onGraduate)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <GraduationCap className="h-4 w-4 text-slate-600" />
                  Graduate
                </button>
              ) : null}
              <button
                type="button"
                role="menuitem"
                onClick={() => run(onDelete)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete Record
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

export default TraineeRowActions
