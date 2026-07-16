type SkeletonProps = {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
}

export function SkeletonRow({ cols = 6 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 sm:px-6">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={i === 0 ? 'h-4 flex-1' : i === cols - 1 ? 'h-8 w-20' : 'h-4 flex-1'}
        />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-card border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-3 sm:px-6">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-slate-100 bg-white p-6 ${className}`}>
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

export default Skeleton

