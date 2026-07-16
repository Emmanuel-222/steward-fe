import { Clock, XCircle } from 'lucide-react'
import useMyExcusesQuery from '../features/attendance/hooks/useMyExcusesQuery'
import type { MyExcuseRequest } from '../features/attendance/types'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'

const statusConfig = {
  Pending: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500 animate-pulse' },
  Approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Rejected: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
} as const

function MyExcusesPage() {
  const { data: excuses, isLoading } = useMyExcusesQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Clock className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!excuses?.length) {
    return (
      <div className="space-y-8">
        <DashboardPageHeader
          title="My Excuses"
          description="Track your submitted excuse requests."
        />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <XCircle className="h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-500">No excuse requests yet</p>
          <p className="mt-1 text-sm text-slate-400">If you miss a session, you can submit an excuse from the attendance page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="My Excuses"
        description="Review the status of your submitted excuse requests."
      />

      <div className="space-y-3">
        {(excuses as MyExcuseRequest[]).map((excuse) => {
          const config = statusConfig[excuse.status as keyof typeof statusConfig] ?? statusConfig.Pending
          return (
            <div
              key={excuse.id}
              className="rounded-card border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg font-bold text-brand truncate">
                    {excuse.meeting.title || `${excuse.meeting.type} Meeting`}
                  </h3>
                  <p className="text-sm font-medium text-slate-400">
                    {excuse.meeting.date.split('T')[0]} &middot; {excuse.meeting.type}
                  </p>
                </div>
                <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${config.bg} ${config.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  {excuse.status}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50/70 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Reason</p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{excuse.reason}</p>
              </div>

              {excuse.adminComment && (
                <div className="mt-3 rounded-2xl bg-indigo-50/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">Admin Response</p>
                  <p className="text-sm font-medium text-indigo-700 leading-relaxed">{excuse.adminComment}</p>
                </div>
              )}

              <p className="mt-3 text-[11px] font-medium text-slate-400">
                Submitted {new Date(excuse.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyExcusesPage


