import { Search } from 'lucide-react'

type AppHeaderProps = {
  onSearchClick?: () => void
}

function AppHeader({ onSearchClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            System Console
          </p>
          <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">
            Steward Registry
          </h1>
        </div>

        <div className="w-full lg:flex lg:w-auto lg:flex-1 lg:justify-end">
          <button
            type="button"
            onClick={onSearchClick}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700 lg:max-w-sm"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Search stewards, meetings...</span>
            <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline-block">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
