import { TrendingDown, TrendingUp } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string | number
  detail: string
  detailClassName?: string
  trend?: {
    value: number
    isUpward: boolean
  }
  className?: string
  isLoading?: boolean
}

function StatCard({
  label,
  value,
  detail,
  detailClassName = 'text-slate-500',
  trend,
  className = 'border-slate-200',
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return (
      <article className={`rounded-3xl border bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] ${className} animate-pulse`}>
        <div className="h-3 w-16 rounded-full bg-slate-100" />
        <div className="mt-5 flex items-end gap-3">
          <div className="h-9 w-20 rounded-lg bg-slate-200" />
          <div className="h-3 w-12 rounded-full bg-slate-100 mb-1" />
        </div>
      </article>
    )
  }
  return (
    <article
      className={`rounded-3xl border bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {label}
        </p>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.isUpward ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend.isUpward ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-4 flex items-end gap-2">
        <p className="text-3xl font-semibold tracking-tight text-[#0f2d52] sm:text-4xl">
          {value}
        </p>
        <span className={`pb-1 text-xs font-semibold ${detailClassName}`}>
          {detail}
        </span>
      </div>
    </article>
  )
}

export default StatCard
