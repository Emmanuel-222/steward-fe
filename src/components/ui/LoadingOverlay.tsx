import { Loader2 } from 'lucide-react'

type LoadingOverlayProps = {
  label?: string
}

function LoadingOverlay({ label = 'Working…' }: LoadingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-brand/45 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-12 w-12 animate-spin text-white motion-reduce:animate-none" aria-hidden="true" />
      <p className="text-sm font-semibold tracking-wide text-white">{label}</p>
    </div>
  )
}

export default LoadingOverlay
