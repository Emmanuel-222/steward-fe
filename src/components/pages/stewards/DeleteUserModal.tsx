import { AlertTriangle } from 'lucide-react'
import type { Steward } from '../../../features/stewards/types'

type DeleteUserModalProps = {
  steward: Steward | null
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isSubmitting: boolean
}

function DeleteUserModal({
  steward,
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: DeleteUserModalProps) {
  if (!open || !steward) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 text-center shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3
          id="delete-user-title"
          className="mt-5 text-2xl font-semibold text-slate-900"
        >
          Delete User Account
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Are you sure you want to delete this user? This action will permanently
          remove <span className="font-semibold text-slate-700">{steward.name}</span>{' '}
          from the registry and delete all associated attendance history. This
          action cannot be undone.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#eef3ff] px-4 py-3 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
          >
            Keep User
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-[#d92d20] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#b42318]"
          >
            {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Authority Clearance Required: Level 4
        </p>
      </div>
    </div>
  )
}

export default DeleteUserModal
