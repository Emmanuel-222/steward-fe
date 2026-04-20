function AppHeader() {
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
          <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 shadow-sm lg:max-w-sm">
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search stewards or records"
              className="w-full min-w-0 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
