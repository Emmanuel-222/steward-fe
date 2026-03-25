import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'

type SearchFieldProps = InputHTMLAttributes<HTMLInputElement>

function SearchField(props: SearchFieldProps) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-[0_18px_55px_rgba(15,23,42,0.04)]">
      <Search className="h-4 w-4 shrink-0" />
      <input
        type="search"
        className="w-full min-w-0 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        {...props}
      />
    </label>
  )
}

export default SearchField
