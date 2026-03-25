function LoginShowcase() {
  return (
    <section className="flex flex-col justify-between bg-[#0d2f57] p-8 text-white sm:p-10">
      <div className="space-y-10">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#0d2f57]">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l7-4 7 4v14" />
              <path d="M9 9h.01" />
              <path d="M15 9h.01" />
              <path d="M9 13h.01" />
              <path d="M15 13h.01" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Steward Registry
          </span>
        </div>

        <div className="max-w-xs space-y-5">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            The Digital Registrar.
          </h1>
          <p className="text-sm leading-7 text-slate-300">
            Precision attendance management for the modern ministry. Secure,
            authoritative, and seamless.
          </p>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-[#0d2f57]">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20 21a8 8 0 1 0-16 0" />
              <circle cx="12" cy="7" r="4" />
              <path d="M19 8h2" />
              <path d="M20 7v2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Verified Access Only</p>
            <p className="text-xs text-slate-300">System ID 836-024-ALPHA</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginShowcase
