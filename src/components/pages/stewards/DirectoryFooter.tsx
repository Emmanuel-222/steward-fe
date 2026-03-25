function DirectoryFooter() {
  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <p>&copy; 2024 Steward Registry | Digital Registrar, System v2.4.0</p>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="transition hover:text-slate-600">
          Documentation
        </button>
        <button type="button" className="transition hover:text-slate-600">
          Privacy Policy
        </button>
        <button type="button" className="transition hover:text-slate-600">
          System Support
        </button>
      </div>
    </div>
  )
}

export default DirectoryFooter
