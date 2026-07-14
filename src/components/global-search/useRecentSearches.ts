import { useCallback, useEffect, useRef, useState } from 'react'
import type { RecentSearch } from './types'

const STORAGE_KEY = 'globalSearch:recents'
const MAX_RECENTS = 10

function getRecents(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (r): r is RecentSearch =>
        typeof r === 'object' && r !== null && typeof r.query === 'string' && typeof r.timestamp === 'number',
    )
  } catch {
    return []
  }
}

function persistRecents(recents: RecentSearch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recents))
}

function useRecentSearches() {
  const [recents, setRecents] = useState<RecentSearch[]>(getRecents)
  const recentsRef = useRef(recents)

  useEffect(() => {
    recentsRef.current = recents
  }, [recents])

  const syncFromStorage = useCallback(() => {
    const stored = getRecents()
    const current = recentsRef.current
    if (
      stored.length !== current.length ||
      stored.some((r, i) => r.query !== current[i]?.query || r.timestamp !== current[i]?.timestamp)
    ) {
      setRecents(stored)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('storage', syncFromStorage)
    return () => window.removeEventListener('storage', syncFromStorage)
  }, [syncFromStorage])

  const addRecent = useCallback((query: string) => {
    if (!query.trim()) return
    const current = getRecents()
    const filtered = current.filter(
      (r) => r.query.toLowerCase() !== query.toLowerCase(),
    )
    const updated = [{ query: query.trim(), timestamp: Date.now() }, ...filtered].slice(
      0,
      MAX_RECENTS,
    )
    persistRecents(updated)
    setRecents(updated)
  }, [])

  const clearRecents = useCallback(() => {
    persistRecents([])
    setRecents([])
  }, [])

  return { recents, addRecent, clearRecents }
}

export default useRecentSearches
