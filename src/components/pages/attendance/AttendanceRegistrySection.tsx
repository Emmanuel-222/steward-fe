import { Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { MeetingAttendanceEntry } from '../../../features/attendance/types'
import SearchField from '../../shared/SearchField'

type AttendanceRegistrySectionProps = {
  entries: MeetingAttendanceEntry[]
  activeFilter: string
  filters: string[]
  onFilterChange: (filter: string) => void
  onMarkPresent: (userId: string) => void
  markingUserId: string | null
  isCutoffPassed?: boolean
}

function AttendanceRegistrySection({
  entries,
  activeFilter,
  filters,
  onFilterChange,
  onMarkPresent,
  markingUserId,
  isCutoffPassed = false,
}: AttendanceRegistrySectionProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const searched = searchTerm.trim()
    ? entries.filter((entry) => {
        const term = searchTerm.toLowerCase()
        return (
          entry.steward.name.toLowerCase().includes(term) ||
          entry.steward.email.toLowerCase().includes(term) ||
          entry.steward.department.toLowerCase().includes(term)
        )
      })
    : entries

  return (
    <section className="space-y-5 rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={[
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                activeFilter === filter
                  ? 'bg-[#0f2d52] text-white'
                  : 'bg-[#f4f7fb] text-slate-500 hover:bg-slate-100 hover:text-slate-700',
              ].join(' ')}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField
            placeholder="Search stewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px] space-y-3">
          <div className="hidden grid-cols-[1.5fr_1fr_0.8fr_1.2fr] gap-4 px-4 pb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 lg:grid">
            <p>Steward Information</p>
            <p>Department / Role</p>
            <p>Current Status</p>
            <p className="text-right">Action</p>
          </div>

        {searched.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-[#fcfdff] px-6 py-10 text-center text-sm text-slate-500">
            {searchTerm.trim()
              ? 'No stewards match your search.'
              : 'No stewards to display.'}
          </div>
        ) : (
          searched.map((entry) => {
            const isPresent = entry.status === 'Present'
            const isMarking = markingUserId === entry.steward.id

            return (
              <article
                key={entry.steward.id}
                className={`grid gap-4 rounded-3xl border ${
                  isPresent ? 'border-emerald-200' : 'border-transparent'
                } bg-[#fcfdff] p-4 shadow-sm lg:grid-cols-[1.5fr_1fr_0.8fr_1.2fr] lg:items-center`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d52] text-sm font-semibold text-white">
                    {entry.steward.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {entry.steward.name}
                    </p>
                    <p className="break-all text-sm text-slate-500 sm:break-normal">
                      {entry.steward.email}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="inline-flex rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-medium text-[#5471a8]">
                    {entry.steward.role}
                  </span>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      isPresent
                        ? 'bg-emerald-100 text-emerald-700'
                        : (entry.status === 'Absent' || (entry.status === 'Unmarked' && isCutoffPassed))
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {entry.status === 'Unmarked' && isCutoffPassed ? 'Absent' : entry.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                  {isPresent ? (
                    <span className="text-sm text-slate-400">
                      Checked in{entry.markedAt ? ` at ${entry.markedAt}` : ''}
                    </span>
                  ) : entry.status === 'Absent' || (entry.status === 'Unmarked' && isCutoffPassed) ? (
                    <span className="text-sm font-medium text-rose-600">
                      {entry.status === 'Absent' ? 'Marked Absent' : 'Cutoff Passed'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={isMarking}
                      onClick={() => onMarkPresent(entry.steward.id)}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isMarking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {isMarking ? 'Marking...' : 'Mark Present'}
                    </button>
                  )}
                </div>
              </article>
            )
          })
        )}
        </div>
      </div>
    </section>
  )
}

export default AttendanceRegistrySection
