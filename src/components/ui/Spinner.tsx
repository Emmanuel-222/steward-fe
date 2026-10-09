import { Loader2 } from 'lucide-react'

function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center py-16 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default Spinner
