import { Check, Clock, MessageSquare, X } from 'lucide-react'
import useExcuseRequestsQuery from '../features/attendance/hooks/useExcuseRequestsQuery'
import useResolveExcuseMutation from '../features/attendance/hooks/useResolveExcuseMutation'
import { useToast } from '../hooks/useToast'
import useAuth from '../hooks/useAuth'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'

function ExcuseRequestsPage() {
  const { user } = useAuth()
  const { data: requests, isLoading } = useExcuseRequestsQuery()
  const resolveMutation = useResolveExcuseMutation()
  const { showToast } = useToast()

  const isAdminOrPastor = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'pastor'

  const handleResolve = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      await resolveMutation.mutateAsync({ id, status })
      showToast(`Request ${status.toLowerCase()} successfully`, 'success')
    } catch {
      showToast(`Failed to ${status.toLowerCase()} request`, 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Clock className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="space-y-8">
        <DashboardPageHeader
          title="Excuse Requests"
          description="Review and manage excuse requests from stewards."
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MessageSquare className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-500">No pending excuses</p>
          <p className="mt-1 text-sm text-slate-400">All excuse requests have been reviewed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Excuse Requests"
        description={
          isAdminOrPastor
            ? `Managing ${requests.length} pending excuse request${requests.length > 1 ? 's' : ''} across all departments.`
            : `Managing ${requests.length} pending excuse request${requests.length > 1 ? 's' : ''} for your department.`
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((req: {
          id: number
          reason: string
          adminComment?: string
          steward: { fullName: string; department: string }
          meeting: { type: string; date: string; title?: string }
        }) => (
          <div
            key={req.id}
            className="group relative flex flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition hover:shadow-lg hover:border-slate-300"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <p className="text-sm font-bold text-[#0f2d52] truncate">{req.steward.fullName}</p>
                <p className="text-[10px] font-medium text-slate-400">
                  {req.meeting.title || `${req.meeting.type} Session`} &middot; {req.meeting.date.split('T')[0]}
                </p>
                {isAdminOrPastor && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
                    {req.steward.department}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleResolve(req.id, 'Approved')}
                  disabled={resolveMutation.isPending}
                  className="p-2.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition active:scale-90 disabled:opacity-40"
                  title="Approve"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </button>
                <button
                  onClick={() => handleResolve(req.id, 'Rejected')}
                  disabled={resolveMutation.isPending}
                  className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition active:scale-90 disabled:opacity-40"
                  title="Reject"
                >
                  <X className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>

            <div className="mt-auto rounded-2xl bg-slate-50/70 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Reason</p>
              <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{req.reason}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExcuseRequestsPage
