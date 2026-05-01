import { Bolt, Check, History, Loader2, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { MeetingAttendanceEntry } from '../../../features/attendance/types'

type AttendanceRegistrySectionProps = {
  entries: MeetingAttendanceEntry[]
  activeFilter: string
  filters: string[]
  onFilterChange: (filter: string) => void
  onMarkPresent: (userId: string) => void
  onMarkAbsent?: (userId: string) => void
  markingUserId: string | null
  cutoffDate?: Date | null
  isRushMode?: boolean
  meetingTitle?: string
}

function AttendanceRegistrySection({
  entries,
  activeFilter,
  filters,
  onFilterChange,
  onMarkPresent,
  onMarkAbsent,
  markingUserId,
  cutoffDate = null,
  isRushMode = false,
  meetingTitle = 'Meeting',
}: AttendanceRegistrySectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)

  const searched = searchTerm.trim()
    ? entries.filter((entry) => {
        const term = searchTerm.toLowerCase()
        return (
          entry.steward.name.toLowerCase().includes(term) ||
          entry.steward.email.toLowerCase().includes(term) ||
          entry.steward.role.toLowerCase().includes(term)
        )
      })
    : entries

  useEffect(() => {
    if (!isRushMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault()
        setFocusedIndex((prev) => Math.min(prev + 1, searched.length - 1))
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault()
        setFocusedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === ' ') {
        if (focusedIndex >= 0 && focusedIndex < searched.length) {
          const entry = searched[focusedIndex]
          if (entry.status === 'Unmarked' && !markingUserId) {
            e.preventDefault()
            onMarkPresent(entry.steward.id)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRushMode, searched, focusedIndex, markingUserId, onMarkPresent])


  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const count = entries.filter(e => {
              if (filter === 'Present Only') return e.status === 'Present'
              if (filter === 'Absent Only') return e.status === 'Absent'
              if (filter === 'Pending') return e.status === 'Unmarked'
              return true
            }).length

            return (
              <button
                key={filter}
                type="button"
                onClick={() => {
                   onFilterChange(filter)
                   setFocusedIndex(-1)
                }}
                className={[
                  'rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200',
                  activeFilter === filter
                    ? 'bg-[#0f2d52] text-white shadow-[0_10px_25px_rgba(15,45,82,0.15)]'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800',
                ].join(' ')}
              >
                {filter} {filter !== 'All Stewards' && <span className="ml-1.5 opacity-50">{count}</span>}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f2d52] transition-colors" />
            <input
              type="text"
              placeholder="Search stewards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none ring-slate-400/20 transition focus:border-[#0f2d52] focus:ring-4 lg:w-80"
            />
          </div>
          <button className="p-3.5 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition">
             <Bolt className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[32px] border border-slate-200 bg-white p-2 shadow-[0_20px_70px_rgba(15,23,42,0.04)]">
        <div className="min-w-[800px]">
          <div className={`grid ${isRushMode ? 'grid-cols-[3fr_1fr_1.5fr]' : 'grid-cols-[2fr_1fr_1.5fr_1.5fr]'} gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 border-b border-slate-50`}>
            <p>Steward Information</p>
            {!isRushMode && <p>Role</p>}
            <p>Live Status</p>
            <p className="text-right pr-4">Quick Marking Actions</p>
          </div>

          <div ref={listRef} className="p-2 space-y-1">
            {searched.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm font-medium text-slate-400">No stewards match your criteria.</p>
              </div>
            ) : (
              searched.map((entry, index) => {
                const isPresent = entry.status === 'Present'
                const isAbsent = entry.status === 'Absent'
                const isMarking = markingUserId === entry.steward.id
                const isFocused = focusedIndex === index

                return (
                  <article
                    key={entry.steward.id}
                    className={[
                      'group grid gap-4 rounded-2xl p-3 items-center transition-all duration-200',
                      isRushMode ? 'grid-cols-[3fr_1fr_1.5fr]' : 'grid-cols-[2fr_1fr_1.5fr_1.5fr]',
                      isFocused ? 'bg-blue-50 ring-2 ring-[#0f2d52]/10' : 'hover:bg-slate-50',
                      isPresent ? 'bg-emerald-50/30' : ''
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white overflow-hidden shadow-sm">
                           {entry.steward.initials}
                         </div>
                         {isPresent && (
                            <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                               <Check className="h-2 w-2 text-white stroke-[4]" />
                            </div>
                         )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#0f2d52] truncate">
                          {entry.steward.name}
                        </p>
                        {!isRushMode && (
                          <p className="text-[11px] font-medium text-slate-400 truncate">
                            {entry.steward.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isRushMode && (
                      <div>
                        <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100">
                          {entry.steward.role}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                       {isPresent ? (
                         <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-[10px] font-bold text-emerald-700">
                               PRESENT
                            </span>
                            <span className="mt-1 text-[9px] font-bold text-slate-400 flex items-center gap-1">
                               <History className="h-3 w-3" />
                               {entry.markedAt ? `Checked in at ${entry.markedAt}` : 'Confirmed'}
                               {entry.markedAt && cutoffDate && (() => {
                                  try {
                                    const [time, modifier] = entry.markedAt!.split(' ')
                                    let [hours, minutes] = time.split(':').map(Number)
                                    if (modifier === 'PM' && hours < 12) hours += 12
                                    if (modifier === 'AM' && hours === 12) hours = 0
                                    
                                    // Use the meeting date from the cutoffDate to ensure correct comparison
                                    const markedTime = new Date(cutoffDate)
                                    markedTime.setHours(hours, minutes, 0, 0)
                                    
                                    return markedTime > cutoffDate
                                  } catch (e) {
                                    return false
                                  }
                               })() && (
                                  <span className="ml-1 rounded bg-rose-50 px-1.5 py-0.5 text-[8px] font-black text-rose-600 border border-rose-100 shadow-sm animate-pulse">LATE</span>
                               )}
                            </span>
                         </div>
                       ) : isAbsent ? (
                         <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 px-3 py-1 text-[10px] font-bold text-rose-700">
                            ABSENT
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-500">
                            <div className="h-1 w-1 rounded-full bg-slate-400" />
                            UNMARKED
                         </span>
                       )}
                    </div>

                    <div className="flex items-center justify-end pr-2 gap-2">
                       {isPresent ? (
                         <>
                            <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                               <History className="h-4 w-4" />
                            </button>
                            <button className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                               <Bolt className="h-4 w-4" />
                            </button>
                         </>
                       ) : (
                         <>
                            <button
                              type="button"
                              disabled={isMarking || isAbsent}
                              onClick={() => onMarkPresent(entry.steward.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-[11px] font-bold text-emerald-700 border border-emerald-200 transition hover:bg-emerald-500 hover:text-white hover:border-emerald-600 disabled:opacity-50"
                            >
                              {isMarking ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3 stroke-[3]" />
                              )}
                              Mark Present
                            </button>
                            <button 
                              type="button"
                              disabled={isMarking || isAbsent}
                              onClick={() => onMarkAbsent?.(entry.steward.id)}
                              className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition disabled:opacity-50"
                            >
                               <Check className="h-4 w-4 rotate-45" />
                            </button>
                         </>
                       )}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex items-center justify-center">
         <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            End of Registry List for {meetingTitle}
         </p>
      </div>
    </section>
  )
}

export default AttendanceRegistrySection
