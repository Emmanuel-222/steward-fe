import { X } from 'lucide-react'
import { useState } from 'react'
import type { RollupTrainee } from '../../../features/training/types'
import { useAnimatedMount } from '../../../hooks/useAnimatedMount'
import { useDialogA11y } from '../../../hooks/useDialogA11y'
import PhoneInput from '../../ui/PhoneInput'
import { toE164Phone } from '../../../utils/phone'

export type EditTraineeValues = {
  name: string
  phone: string
  birthday: string
  track: 'new' | 'refresher'
}

type EditTraineeModalProps = {
  trainee: RollupTrainee | null
  open: boolean
  onClose: () => void
  onSubmit: (values: EditTraineeValues) => Promise<void>
  isSubmitting: boolean
}

function isValidBirthday(value: string) {
  if (!value) return true
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false
  const [day, month, year] = value.split('/').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function EditTraineeModal({ trainee, open, onClose, onSubmit, isSubmitting }: EditTraineeModalProps) {
  const { mounted, phase } = useAnimatedMount(open)
  const dialogRef = useDialogA11y<HTMLDivElement>(onClose)
  const [name, setName] = useState(trainee?.name ?? '')
  const [phone, setPhone] = useState(
    trainee?.phone && trainee.phone !== 'N/A' ? toE164Phone(trainee.phone) : '',
  )
  const [birthday, setBirthday] = useState(trainee?.birthday ?? '')
  const [track, setTrack] = useState<'new' | 'refresher'>(
    trainee?.track === 'refresher' ? 'refresher' : 'new',
  )
  const [error, setError] = useState('')

  if (!mounted || !trainee) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (name.trim().length < 2) {
      setError('Full name must be at least 2 characters long')
      return
    }
    if (!/^\+234\d{10}$/.test(phone)) {
      setError('Enter a valid Nigerian phone number')
      return
    }
    if (!isValidBirthday(birthday)) {
      setError('Use DD/MM/YYYY format for the birthday')
      return
    }
    setError('')
    try {
      await onSubmit({ name: name.trim(), phone, birthday, track })
      onClose()
    } catch {
      setError('Unable to update this trainee right now.')
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px] ${phase === 'enter' ? 'animate-fade-in' : ''} ${phase === 'exit' ? 'animate-modal-exit' : ''}`}
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <div
          className={`max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-6 ${phase === 'enter' ? 'animate-modal-enter' : 'animate-modal-exit'}`}
          ref={dialogRef}
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-trainee-title"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 id="edit-trainee-title" className="text-xl font-semibold text-slate-900">
                Edit trainee
              </h3>
              <p className="mt-1 text-sm text-slate-500">{trainee.email}</p>
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

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 sm:col-span-2">
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
              Phone
              <PhoneInput value={phone} onChange={setPhone} />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
              Birthday (DD/MM/YYYY)
              <input
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="01/01/2000"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-600 sm:col-span-2">
              Track
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value === 'refresher' ? 'refresher' : 'new')}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand"
              >
                <option value="new">New</option>
                <option value="refresher">Refresher</option>
              </select>
            </label>

            {error ? (
              <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">{error}</p>
            ) : null}

            <div className="flex items-center justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#eef3ff] px-4 py-2.5 text-sm font-semibold text-[#4f6b9a] transition hover:bg-[#e4ebfb]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditTraineeModal
