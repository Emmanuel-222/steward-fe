import { Check, MessageSquare, X } from 'lucide-react'
import useExcuseRequestsQuery from '../../../features/attendance/hooks/useExcuseRequestsQuery'
import useResolveExcuseMutation from '../../../features/attendance/hooks/useResolveExcuseMutation'
import { useToast } from '../../../hooks/useToast'
import useAuth from '../../../hooks/useAuth'

function PendingExcusesBanner() {
  const { user } = useAuth()
  const { data: requests, isLoading } = useExcuseRequestsQuery()
  const resolveMutation = useResolveExcuseMutation()
  const { showToast } = useToast()

  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'pastor'

  if (isLoading || !requests || requests.length === 0) return null

  const handleResolve = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      await resolveMutation.mutateAsync({ id, status })
      showToast(`Request ${status.toLowerCase()} successfully`, 'success')
    } catch {
      showToast(`Failed to ${status.toLowerCase()} request`, 'error')
    }
  }

  return (
    <div className="rounded-4xl border border-sky-100 bg-sky-50/50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-sky-900">Pending Excuse Requests</h3>
            <p className="text-[11px] font-medium text-sky-600">
              {isAdmin ? 'Global Overview' : `Department: ${user?.department}`} • {requests.length} pending
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((req: { id: number; reason: string; steward: { fullName: string; department: string }; meeting: { type: string } }) => (
          <div key={req.id} className="group relative flex flex-col rounded-3xl border border-sky-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-sky-200">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-sky-900/40">
                  {req.steward.fullName}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
                    {req.steward.department}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleResolve(req.id, 'Approved')}
                  disabled={resolveMutation.isPending}
                  className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition active:scale-90"
                  title="Approve"
                >
                  <Check className="h-4 w-4 stroke-3" />
                </button>
                <button
                  onClick={() => handleResolve(req.id, 'Rejected')}
                  disabled={resolveMutation.isPending}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition active:scale-90"
                  title="Reject"
                >
                  <X className="h-4 w-4 stroke-3" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-slate-700">
                {req.meeting.type} Session
              </p>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                  "{req.reason}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingExcusesBanner
