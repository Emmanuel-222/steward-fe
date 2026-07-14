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
    <section className="grid gap-4 lg:grid-cols-[220px_1fr_160px]">
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

      <select
        value={roleValue}
        onChange={(event) => onRoleChange(event.target.value)}
        className="flex h-[58px] w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-10 text-sm font-medium text-slate-600 shadow-[0_18px_55px_rgba(15,23,42,0.04)] outline-none appearance-none cursor-pointer"
        aria-label="Filter by role"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
          backgroundSize: '16px',
        }}
      >
        <option value="All Roles">All Roles</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    </section>
  )
}

export default StewardsToolbar
