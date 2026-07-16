import {
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  History,
  LayoutDashboard,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimatedMount } from '../../hooks/useAnimatedMount'
import { useNavigate } from 'react-router-dom'
import useGlobalSearch from './useGlobalSearch'
import useRecentSearches from './useRecentSearches'
import type { SearchGroup, SearchResultItem } from './types'

const GROUP_ORDER: SearchGroup[] = ['stewards', 'departments', 'meetings', 'pages', 'actions']

const GROUP_LABELS: Record<SearchGroup, string> = {
  stewards: 'Stewards',
  departments: 'Departments',
  meetings: 'Meetings',
  pages: 'Pages',
  actions: 'Quick Actions',
}

const quickLinks = [
  { label: 'Go to Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'View All Stewards', to: '/dashboard/stewards', icon: Users },
  { label: 'View All Meetings', to: '/dashboard/meetings', icon: CalendarDays },
  { label: 'Mark Attendance', to: '/dashboard/attendance', icon: ClipboardList },
]

type GlobalSearchOverlayProps = {
  isOpen: boolean
  onClose: () => void
}

function GlobalSearchOverlay({ isOpen, onClose }: GlobalSearchOverlayProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { results, isLoading } = useGlobalSearch(query)
  const { recents, addRecent, clearRecents } = useRecentSearches()

  const groupedResults = useMemo(() => {
    const grouped: { group: SearchGroup; items: SearchResultItem[] }[] = []
    for (const group of GROUP_ORDER) {
      const groupItems = results.filter((r) => r.group === group)
      if (groupItems.length > 0) {
        grouped.push({ group, items: groupItems })
      }
    }
    return grouped
  }, [results])

  const flatItems = useMemo(
    () => groupedResults.flatMap((g) => g.items),
    [groupedResults],
  )

  const safeSelectedIndex =
    flatItems.length > 0
      ? Math.max(0, Math.min(selectedIndex, flatItems.length - 1))
      : -1

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (safeSelectedIndex < 0 || !listRef.current) return
    const items = listRef.current.querySelectorAll<HTMLElement>('[data-result-index]')
    const el = items[safeSelectedIndex]
    el?.scrollIntoView({ block: 'nearest' })
  }, [safeSelectedIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1))
    } else if (e.key === 'Enter' && safeSelectedIndex >= 0) {
      e.preventDefault()
      const item = flatItems[safeSelectedIndex]
      addRecent(query)
      item.action()
      onClose()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      setSelectedIndex((prev) => {
        if (e.shiftKey) return prev > 0 ? prev - 1 : flatItems.length - 1
        return prev < flatItems.length - 1 ? prev + 1 : 0
      })
    }
  }

  const handleResultClick = (item: SearchResultItem) => {
    addRecent(query)
    item.action()
    onClose()
  }

  const { mounted, phase } = useAnimatedMount(isOpen)
  if (!mounted) return null

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div className={`fixed inset-0 bg-slate-950/30 backdrop-blur-[2px] ${phase === 'enter' ? 'animate-fade-in' : ''} ${phase === 'exit' ? 'animate-modal-exit' : ''}`} />

      <div
        className={`relative z-10 mx-auto mt-0 flex w-full max-w-none flex-col bg-white shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:mt-[12vh] sm:max-w-[560px] sm:rounded-2xl rounded-none h-full sm:h-auto ${phase === 'enter' ? 'animate-slide-down' : ''} ${phase === 'exit' ? 'animate-modal-exit' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 sm:py-3">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search stewards, meetings..."
            className="flex-1 border-none bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400"
            role="combobox"
            aria-expanded={flatItems.length > 0}
            aria-activedescendant={safeSelectedIndex >= 0 ? `result-${safeSelectedIndex}` : undefined}
            aria-label="Global search"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:p-1"
            aria-label="Close search"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </button>
          <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 sm:inline-block">
            ⌘K
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[60vh] flex-1 overflow-y-auto p-2 sm:max-h-[60vh] sm:flex-none" role="listbox">
          {/* INITIAL STATE: no query → recent searches + quick links */}
          {query === '' && recents.length > 0 && (
            <div className="px-1 pb-1">
              <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Recent Searches
              </p>
              {recents.map((r) => (
                <button
                  key={r.timestamp}
                  type="button"
                  onClick={() => setQuery(r.query)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  <History className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="truncate">{r.query}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearRecents}
                className="mt-1 px-3 py-2 text-xs font-medium text-slate-400 transition hover:text-slate-600"
              >
                Clear recent searches
              </button>
            </div>
          )}

          {query === '' && recents.length === 0 && (
            <div className="px-1 pb-1">
              <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Quick Links
              </p>
              {quickLinks.map((link) => (
                <button
                  key={link.to}
                  type="button"
                  onClick={() => {
                    navigate(link.to)
                    onClose()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50"
                >
                  <link.icon className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{link.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
                </button>
              ))}
            </div>
          )}

          {/* LOADING STATE */}
          {query.length >= 2 && isLoading && (
            <div className="space-y-2 p-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
              <p className="pt-2 text-center text-xs text-slate-400">
                Searching stewards...
              </p>
            </div>
          )}

          {/* NO RESULTS */}
          {query.length >= 2 && !isLoading && flatItems.length === 0 && (
            <div className="px-3 py-10 text-center">
              <p className="text-sm font-medium text-slate-500">
                No results found
              </p>
              <ul className="mt-4 space-y-1 text-xs text-slate-400">
                <li>Try searching by steward name, department, or meeting type</li>
                <li>Check for typos or try a shorter search term</li>
              </ul>
            </div>
          )}

          {/* RESULTS */}
          {flatItems.length > 0 &&
            groupedResults.map(({ group, items }) => (
              <div key={group} className="px-1 pb-1">
                <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {GROUP_LABELS[group]}
                </p>
                {items.map((item) => {
                  const globalIndex = flatItems.indexOf(item)
                  const isSelected = safeSelectedIndex === globalIndex

                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`result-${globalIndex}`}
                      data-result-index={globalIndex}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleResultClick(item)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? 'bg-blue-50 ring-1 ring-brand/10'
                          : 'hover:bg-slate-50'
                      } ${item.isViewAll ? 'font-semibold text-brand' : 'text-slate-700'}`}
                    >
                      {item.isViewAll ? (
                        <ChevronRight className="h-4 w-4 shrink-0 text-brand" />
                      ) : (
                        <ResultIcon group={group} image={item.image} />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate">{item.label}</p>
                        {item.description && (
                          <p className="truncate text-xs text-slate-400">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {!item.isViewAll && (
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function ResultIcon({ group, image }: { group: SearchGroup; image?: string }) {
  switch (group) {
    case 'stewards':
      return image ? (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand text-[10px] font-bold text-white">
          {image}
        </div>
      ) : (
        <Users className="h-4 w-4 shrink-0 text-slate-400" />
      )
    case 'departments':
      return <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
    case 'meetings':
      return <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
    case 'pages':
      return <div className="h-4 w-4 shrink-0 rounded-full border border-slate-300" />
    case 'actions':
      return <Plus className="h-4 w-4 shrink-0 text-slate-400" />
  }
}

export default GlobalSearchOverlay

