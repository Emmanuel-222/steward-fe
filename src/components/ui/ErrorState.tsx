import { AlertTriangle, RefreshCw } from 'lucide-react'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
}

function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-rose-100 bg-rose-50/50 px-6 py-12 text-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-rose-700">{message}</p>
        <p className="mt-1 text-xs text-rose-500">Please try again or contact support.</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorState

