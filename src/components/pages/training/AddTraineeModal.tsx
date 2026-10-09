import { useState } from 'react'
import { X } from 'lucide-react'
import { useAnimatedMount } from '../../../hooks/useAnimatedMount'
import type { AddTraineePayload } from '../../../features/training/api'

type AddTraineeModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: AddTraineePayload) => Promise<void>
  isSubmitting: boolean
}

function AddTraineeModal({ open, onClose, onSubmit, isSubmitting }: AddTraineeModalProps) {
  const { mounted, phase } = useAnimatedMount(open)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [track, setTrack] = useState<'new' | 'refresher'>('new')

  if (!mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ fullName, email, phone, track })
    setFullName('')
    setEmail('')
    setPhone('')
    setTrack('new')
  }

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-[2px] ${phase === 'enter' ? 'animate-fade-in' : ''} ${phase === 'exit' ? 'animate-modal-exit' : ''}`}
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-6">
        <div
          className={`w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)] ${phase === 'enter' ? 'animate-modal-enter' : 'animate-modal-exit'}`}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-trainee-title"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 id="add-trainee-title" className="text-xl font-semibold text-brand">
              Add a trainee
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close add trainee dialog"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
              Full name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-600">
              Phone
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" required className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand" />
            </label>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Track</p>
              <div className="inline-flex rounded-xl border border-slate-200 p-1">
                {(['new', 'refresher'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrack(t)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${
                      track === t ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
              >
                {isSubmitting ? 'Adding...' : 'Add trainee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddTraineeModal
