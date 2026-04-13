import { ChevronDown, Filter } from 'lucide-react'
import SearchField from '../../shared/SearchField'
import StatCard from '../../shared/StatCard'

type StewardsToolbarProps = {
  total: string | number
  growth: string
  searchValue: string
  onSearchChange: (value: string) => void
  roleValue: string
  onRoleChange: (value: string) => void
  roles: string[]
}

function StewardsToolbar({
  total,
  growth,
  searchValue,
  onSearchChange,
  roleValue,
  onRoleChange,
  roles,
}: StewardsToolbarProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_160px_56px]">
      <StatCard
        label="Total Stewards"
        value={total}
        detail={growth}
        detailClassName="text-emerald-600"
      />

      <SearchField
        placeholder="Filter by steward name..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <button
        type="button"
        className="relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-600 shadow-[0_18px_55px_rgba(15,23,42,0.04)]"
      >
        <select
          value={roleValue}
          onChange={(event) => onRoleChange(event.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-2xl bg-transparent px-4 text-sm text-transparent outline-none"
          aria-label="Filter by role"
        >
          <option value="All Roles">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <span>{roleValue}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <button
        type="button"
        className="flex h-[58px] items-center justify-center rounded-2xl border border-slate-200 bg-[#eef3f9] text-slate-600 shadow-[0_18px_55px_rgba(15,23,42,0.04)] transition hover:bg-white"
        aria-label="Open filters"
      >
        <Filter className="h-4 w-4" />
      </button>
    </section>
  )
}

export default StewardsToolbar
