type StatCardProps = {
  label: string
  value: string | number
  detail: string
  detailClassName?: string
  className?: string
}

function StatCard({
  label,
  value,
  detail,
  detailClassName = 'text-slate-500',
  className = 'border-slate-200',
}: StatCardProps) {
  return (
    <article
      className={`rounded-3xl border bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)] ${className}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
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
