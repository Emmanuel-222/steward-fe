import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
          <div className="w-full max-w-md rounded-[32px] border border-rose-100 bg-white p-8 text-center shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-500">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="mb-6 text-sm text-slate-500">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0f2d52] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#173c67]"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
