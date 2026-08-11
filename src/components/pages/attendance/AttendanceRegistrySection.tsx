import { ArrowDownAZ, ArrowUpAZ, Bolt, Check, History, Loader2, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  isReadOnly?: boolean
  meetingIsFinalized?: boolean
  justMarkedUserId?: string | null
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
  isReadOnly = false,
  meetingIsFinalized = false,
  justMarkedUserId = null,
}: AttendanceRegistrySectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentSort, setDepartmentSort] = useState<'none' | 'asc' | 'desc'>('none')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const listRef = useRef<HTMLDivElement>(null)

  const toggleDepartmentSort = () => {
    setDepartmentSort((prev) => (prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none'))
  }

  const searched = useMemo(() => {
    let result = searchTerm.trim()
      ? entries.filter((entry) => {
          const term = searchTerm.toLowerCase()
          return (
            entry.steward.name.toLowerCase().includes(term) ||
            entry.steward.email.toLowerCase().includes(term) ||
            entry.steward.role.toLowerCase().includes(term) ||
            entry.steward.department.toLowerCase().includes(term)
          )
        })
      : entries

    if (departmentSort !== 'none') {
      result = [...result].sort((a, b) => {
        const cmp = a.steward.department.localeCompare(b.steward.department)
        return departmentSort === 'asc' ? cmp : -cmp
      })
    }

    return result
  }, [entries, searchTerm, departmentSort])

  const isAllSelected = !isReadOnly && searched.length > 0 && searched.every((e) => selectedIds.has(e.steward.id))

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(searched.map((e) => e.steward.id)))
    }
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const bulkMark = async (status: 'present' | 'absent') => {
    const ids = [...selectedIds]
    setSelectedIds(new Set())
    for (const id of ids) {
      try {
        if (status === 'present') await onMarkPresent(id)
        else await onMarkAbsent?.(id)
      } catch { /* toast handled by caller */ }
    }
  }

  useEffect(() => {
    setSelectedIds(new Set())
  }, [entries, searchTerm, activeFilter])

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

  useEffect(() => {
    setSelectedIds(new Set())
  }, [entries, searchTerm, activeFilter])


  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const count = entries.filter(e => {
              if (filter === 'Present Only') return e.status === 'Present'
              if (filter === 'Absent Only') return e.status === 'Absent'
              if (filter === 'Excused Only') return e.status === 'Excused'
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
                    ? 'bg-brand text-white shadow-[0_10px_25px_rgba(15,45,82,0.15)]'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800',
                ].join(' ')}
              >
                {filter} {filter !== 'All Stewards' && <span className="font-sans ml-1.5 opacity-50">{count}</span>}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors" />
            <input
              type="text"
              placeholder="Search stewards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 font-sans text-sm font-medium text-slate-800 outline-none ring-slate-400/20 transition focus:border-brand focus:ring-4 lg:w-80"
            />
          </div>
          <button
            type="button"
            onClick={toggleDepartmentSort}
            title={`Sort by department (${departmentSort === 'none' ? 'off' : departmentSort})`}
            aria-label={`Sort by department, currently ${departmentSort === 'none' ? 'off' : departmentSort}`}
            className={[
              'p-3.5 rounded-2xl border transition',
              departmentSort !== 'none'
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50',
            ].join(' ')}
          >
             {departmentSort === 'asc' ? <ArrowDownAZ className="h-5 w-5" /> : <ArrowUpAZ className="h-5 w-5" />}
          </button>
          <button aria-label="Toggle rush mode" className="p-3.5 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition">
             <Bolt className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-2 shadow-[0_20px_70px_rgba(15,23,42,0.04)]">
        <div className={`hidden lg:grid ${!isReadOnly ? 'lg:grid-cols-[auto_2fr_1.5fr_auto]' : 'lg:grid-cols-[2fr_1.5fr_auto]'} gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 border-b border-slate-50`}>
          {!isReadOnly && (
            <button onClick={toggleSelectAll} aria-label={isAllSelected ? 'Deselect all' : 'Select all'} className="p-1 text-left">
              <div className={`h-4 w-4 rounded border-2 transition ${isAllSelected ? 'bg-brand border-brand' : 'border-slate-300 hover:border-slate-400'}`}>
                {isAllSelected && <Check className="h-3 w-3 text-white stroke-4" />}
              </div>
            </button>
          )}
          <p>Steward Information</p>
          <p>Live Status</p>
          {!isReadOnly && <p className="text-right pr-4">Quick Marking Actions</p>}
        </div>

        <div ref={listRef} className="p-2 space-y-1">
          {searched.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-medium text-slate-400">No stewards match your criteria.</p>
            </div>
          ) : (
            searched.map((entry, index) => {
               const isMarking = markingUserId === entry.steward.id
              const isPresent = entry.status === 'Present'
              const isAbsent = entry.status === 'Absent'
              const isFocused = focusedIndex === index
              const isJustMarked = justMarkedUserId === entry.steward.id
              const isLate = isPresent && entry.markedAt && cutoffDate && (() => {
                try {
                  const [time, modifier] = entry.markedAt!.split(' ')
                  const [hStr, mStr] = time.split(':')
                  let hours = Number(hStr)
                  const minutes = Number(mStr)
                  if (modifier === 'PM' && hours < 12) hours += 12
                  if (modifier === 'AM' && hours === 12) hours = 0
                  const markedTime = new Date(cutoffDate)
                  markedTime.setHours(hours, minutes, 0, 0)
                  return markedTime > cutoffDate
                } catch { return false }
              })()

              return (
                <article
                  key={entry.steward.id}
                  className={[
                    'group flex flex-col gap-3 rounded-2xl p-3 transition-all duration-200',
                    !isReadOnly ? 'lg:grid lg:grid-cols-[auto_2fr_1.5fr_auto]' : 'lg:grid lg:grid-cols-[2fr_1.5fr_auto]',
                    'lg:items-center',
                    isFocused ? 'bg-blue-50 ring-2 ring-brand/10' : 'hover:bg-slate-50',
                    isJustMarked && !isLate ? 'animate-row-flash bg-emerald-50/30' : isPresent && !isLate ? 'bg-emerald-50/30' : isLate ? 'bg-amber-50/30' : isJustMarked ? 'animate-row-flash bg-emerald-50/30' : ''
                  ].join(' ')}
                >
                  {!isReadOnly && (
                    <div className="flex lg:items-center">
                      <button
                        onClick={() => toggleSelected(entry.steward.id)}
                        aria-label={selectedIds.has(entry.steward.id) ? 'Deselect' : 'Select'}
                        className="p-1 -ml-1"
                      >
                        <div className={`h-4 w-4 rounded border-2 transition ${selectedIds.has(entry.steward.id) ? 'bg-brand border-brand' : 'border-slate-300 hover:border-slate-400'}`}>
                          {selectedIds.has(entry.steward.id) && <Check className="h-3 w-3 text-white stroke-4" />}
                        </div>
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white overflow-hidden shadow-sm">
                         {entry.steward.initials}
                       </div>
                       {isPresent && (
                          <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                             <Check className="h-2 w-2 text-white stroke-4" />
                          </div>
                       )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-brand truncate">
                        {entry.steward.name}
                      </p>
                      {!isRushMode && (
                        <p className="font-sans text-[11px] font-medium text-slate-400 truncate">
                          {entry.steward.email}
                        </p>
                      )}
                      <p className="font-sans text-[10px] font-medium text-slate-400 truncate mt-0.5">
                        {entry.steward.department}
                        <span className="inline-flex ml-1.5 rounded-lg bg-indigo-50 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider text-indigo-600 border border-indigo-100 align-middle">
                          {entry.steward.role}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:block">
                    <div className="flex items-center gap-2">
                       {isPresent ? (
                         <div className="flex flex-col">
                             <span key={`badge-${entry.status}`} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[10px] font-bold animate-scale-in ${isLate ? 'bg-amber-100/80 text-amber-700' : 'bg-emerald-100/80 text-emerald-700'}`}>
                                {isLate ? 'LATE' : 'PRESENT'}
                             </span>
                             <span className="mt-1 font-sans text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                <History className="h-3 w-3" />
                                {entry.markedAt ? `Checked in at ${entry.markedAt}` : 'Confirmed'}
                             </span>
                         </div>
                       ) : entry.status === 'Excused' ? (
                          <div className="flex flex-col">
                              <span key={`badge-${entry.status}`} className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/80 px-3 py-1 font-sans text-[10px] font-bold text-sky-700 animate-scale-in">
                                 EXCUSED
                              </span>
                              {entry.excuseReason && (
                                <span className="mt-1 font-sans text-[9px] font-medium text-sky-600/70 italic px-1 truncate max-w-37.5">
                                  "{entry.excuseReason}"
                                </span>
                              )}
                          </div>
                       ) : meetingIsFinalized ? (
                          <div className="flex flex-col">
                              <span key={`badge-${entry.status}`} className="inline-flex items-center gap-1.5 rounded-full bg-rose-100/80 px-3 py-1 font-sans text-[10px] font-bold text-rose-700 animate-scale-in">
                                 ABSENT
                              </span>
                              <span className="mt-1 font-sans text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                 <History className="h-3 w-3" />
                                 Finalized as absent
                              </span>
                          </div>
                       ) : (
                          <span key={`badge-${entry.status}`} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-sans text-[10px] font-bold text-slate-500">
                             <div className="h-1 w-1 rounded-full bg-slate-400" />
                             UNMARKED
                          </span>
                       )}
                    </div>

                    {!isReadOnly && (
                      <div className="flex lg:hidden gap-2">
                          {isPresent ? (
                            <>
                               <button aria-label="View check-in time" className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                                  <History className="h-3.5 w-3.5" />
                               </button>
                               <button aria-label="Quick actions" className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                                  <Bolt className="h-3.5 w-3.5" />
                               </button>
                            </>
                          ) : (
                            <>
                               <button
                                 type="button"
                                 disabled={isMarking || isAbsent || entry.status === 'Excused'}
                                 onClick={() => onMarkPresent(entry.steward.id)}
                                 className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 transition hover:bg-emerald-500 hover:text-white hover:border-emerald-600 disabled:opacity-50"
                               >
                                 {isMarking ? (
                                   <Loader2 className="h-3 w-3 animate-spin" />
                                 ) : (
                                   <Check className="h-3 w-3 stroke-3" />
                                 )}
                                 Present
                               </button>
                               <button 
                                 type="button"
                                 disabled={isMarking || isAbsent || entry.status === 'Excused'}
                                 onClick={() => onMarkAbsent?.(entry.steward.id)}
                                 title="Mark as Absent"
                                 aria-label="Mark as absent"
                                 className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition disabled:opacity-50"
                               >
                                  <Check className="h-3.5 w-3.5 rotate-45" />
                               </button>
                            </>
                         )}
                       </div>
                     )}
                   </div>

                   {!isReadOnly && (
                     <div className="hidden lg:flex items-center justify-end pr-2 gap-2">
                        {isPresent ? (
                          <>
                             <button aria-label="View check-in time" className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                                <History className="h-4 w-4" />
                             </button>
                             <button aria-label="Quick actions" className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                                <Bolt className="h-4 w-4" />
                             </button>
                          </>
                        ) : (
                         <>
                            <button
                              type="button"
                              disabled={isMarking || isAbsent || entry.status === 'Excused'}
                              onClick={() => onMarkPresent(entry.steward.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-[11px] font-bold text-emerald-700 border border-emerald-200 transition hover:bg-emerald-500 hover:text-white hover:border-emerald-600 disabled:opacity-50"
                            >
                              {isMarking ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3 stroke-3" />
                              )}
                              Mark Present
                            </button>
                            <button 
                              type="button"
                              disabled={isMarking || isAbsent || entry.status === 'Excused'}
                              onClick={() => onMarkAbsent?.(entry.steward.id)}
                              title="Mark as Absent"
                              aria-label="Mark as absent"
                              className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition disabled:opacity-50"
                            >
                               <Check className="h-4 w-4 rotate-45" />
                            </button>
                         </>
                       )}
                    </div>
                  )}
                </article>
              )
            })
          )}
        </div>
      </div>
      
      {!isReadOnly && selectedIds.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl bg-brand px-5 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-4 shadow-[0_-15px_50px_rgba(15,45,82,0.3)] animate-slide-down sm:sticky sm:inset-x-auto sm:bottom-4 sm:z-10 sm:mx-auto sm:flex sm:w-fit sm:items-center sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-3 sm:pb-3 sm:pt-3 sm:shadow-[0_15px_50px_rgba(15,45,82,0.3)] sm:animate-none">
          <div className="flex items-center justify-between sm:contents">
            <span className="font-sans text-xs font-bold text-white/80 whitespace-nowrap">{selectedIds.size} selected</span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/70 transition hover:bg-white/20 sm:hidden"
            >
              Cancel
            </button>
            <div className="hidden h-4 w-px bg-white/20 sm:block" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
            <button
              onClick={() => bulkMark('present')}
              className="flex-1 min-w-[110px] rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-400 active:scale-95 sm:flex-none sm:px-4 sm:py-2 sm:text-[10px]"
            >
              Mark Present
            </button>
            <button
              onClick={() => bulkMark('absent')}
              className="flex-1 min-w-[110px] rounded-xl bg-rose-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-rose-400 active:scale-95 sm:flex-none sm:px-4 sm:py-2 sm:text-[10px]"
            >
              Mark Absent
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="hidden rounded-xl bg-white/10 px-3 py-2 text-[10px] font-bold text-white/70 transition hover:bg-white/20 sm:block"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="pt-4 flex items-center justify-center">
         <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            End of Registry List for {meetingTitle}
         </p>
      </div>
    </section>
  )
}

export default AttendanceRegistrySection

