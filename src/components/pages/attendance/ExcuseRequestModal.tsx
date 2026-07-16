import { X } from 'lucide-react'
import { useState } from 'react'
import useSubmitExcuseMutation from '../../../features/attendance/hooks/useSubmitExcuseMutation'
import { useToast } from '../../../hooks/useToast'

type ExcuseRequestModalProps = {
  meetingId: string
  meetingTitle: string
  isOpen: boolean
  onClose: () => void
}

function ExcuseRequestModal({ meetingId, meetingTitle, isOpen, onClose }: ExcuseRequestModalProps) {
  const [reason, setReason] = useState('')
  const submitMutation = useSubmitExcuseMutation()
  const { showToast } = useToast()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    try {
      await submitMutation.mutateAsync({ meetingId, reason })
      showToast('Excuse request submitted successfully', 'success')
      setReason('')
      onClose()
    } catch {
      showToast('Failed to submit excuse request', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#0f2d52]">Request Excuse</h3>
          <button onClick={onClose} aria-label="Close excuse request dialog" className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm text-slate-500 leading-relaxed">
          Submitting an excuse for <span className="font-bold text-[#0f2d52]">{meetingTitle}</span>. 
          Your request will be reviewed by an admin or leader.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Reason for Absence
            </label>
            <textarea
              required
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Travel, Health issues, Family emergency..."
              className="w-full h-32 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#0f2d52] focus:ring-4 focus:ring-[#0f2d52]/5 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full rounded-2xl bg-[#0f2d52] py-4 text-sm font-bold text-white shadow-[0_15px_40px_rgba(15,45,82,0.2)] transition hover:bg-[#173c67] disabled:opacity-50"
          >
            {submitMutation.isPending ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ExcuseRequestModal
