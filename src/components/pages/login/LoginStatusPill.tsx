function LoginStatusPill() {
  return (
    <div className="absolute bottom-4 right-4 hidden rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700 shadow-sm backdrop-blur md:flex md:items-center md:gap-2">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      Server status: optimal
    </div>
  )
}

export default LoginStatusPill
