import { useQuery } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEPARTMENTS } from '../../constants/departments'
import { getMeetings } from '../../features/meetings/api'
import { meetingTypeOptions } from '../../features/meetings/schema'
import { getStewards } from '../../features/stewards/api'
import useAuth from '../../hooks/useAuth'
import type { SearchResultItem } from './types'

const meetingStatuses = ['Upcoming', 'Ongoing', 'Completed', 'Archived'] as const

const meetingTypeLabels: Record<string, string> = {
  Sunday: 'Sunday Service',
  Special: 'Special Meeting',
  'Prayer Meeting': 'Prayer Meeting',
}

function countBy<T extends Record<string, unknown>>(items: T[], key: string): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const item of items) {
    const val = String(item[key] ?? '')
    counts[val] = (counts[val] ?? 0) + 1
  }
  return counts
}

function useGlobalSearch(query: string) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()
  const isAuthorized = role === 'admin' || role === 'leader' || role === 'pastor'
  const isAdmin = role === 'admin'

  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150)
    return () => clearTimeout(timer)
  }, [query])

  const stewardSearch = useQuery({
    queryKey: ['globalSearch', 'stewards', debouncedQuery],
    queryFn: () => getStewards(debouncedQuery),
    enabled: debouncedQuery.length >= 2 && isAuthorized,
    staleTime: 30000,
    retry: 1,
  })

  const meetingsQuery = useQuery({
    queryKey: ['globalSearch', 'meetings', 'list'],
    queryFn: getMeetings,
    enabled: isAuthorized,
    staleTime: 30000,
    refetchInterval: false,
  })

  const results = useMemo(() => {
    if (query.length < 2) return []

    const items: SearchResultItem[] = []
    const queryLower = query.toLowerCase()
    const meetings = meetingsQuery.data ?? []

    if (isAuthorized && stewardSearch.data) {
      for (const s of stewardSearch.data.slice(0, 5)) {
        items.push({
          id: `steward-${s.id}`,
          label: s.name,
          description: `${s.department} — ${s.role}`,
          image: s.initials,
          group: 'stewards',
          action: () => navigate(`/dashboard/stewards/${s.id}`),
        })
      }

      if (stewardSearch.data.length > 5) {
        const total = stewardSearch.data.length
        items.push({
          id: 'stewards-view-all',
          label: `View all ${total} stewards`,
          description: '',
          group: 'stewards',
          isViewAll: true,
          action: () => navigate(`/dashboard/stewards?search=${encodeURIComponent(query)}`),
        })
      }
    }

    if (isAuthorized) {
      const deptFuse = new Fuse(DEPARTMENTS, { threshold: 0.3 })
      const deptResults = deptFuse.search(query)
      const stewardDeptCounts = countBy(
        (stewardSearch.data ?? []) as Record<string, unknown>[],
        'department',
      )
      for (const { item: dept } of deptResults.slice(0, 5)) {
        items.push({
          id: `dept-${dept}`,
          label: dept,
          description: `${stewardDeptCounts[dept] ?? 0} stewards`,
          group: 'departments',
          action: () =>
            navigate(`/dashboard/stewards?department=${encodeURIComponent(dept)}`),
        })
      }
    }

    if (isAuthorized && meetings.length > 0) {
      const typeFuse = new Fuse([...meetingTypeOptions], { threshold: 0.3 })
      const typeResults = typeFuse.search(query)
      const meetingTypeCounts = countBy(meetings as unknown as Record<string, unknown>[], 'type')

      const statusFuse = new Fuse([...meetingStatuses], { threshold: 0.3 })
      const statusResults = statusFuse.search(query)
      const meetingStatusCounts = countBy(meetings as unknown as Record<string, unknown>[], 'status')

      for (const { item: typeVal } of typeResults.slice(0, 5)) {
        const label = meetingTypeLabels[typeVal] ?? typeVal
        const count = meetingTypeCounts[typeVal] ?? 0
        items.push({
          id: `meeting-type-${typeVal}`,
          label,
          description: `${count} meetings`,
          group: 'meetings',
          action: () => navigate(`/dashboard/meetings?type=${encodeURIComponent(typeVal)}`),
        })
      }

      for (const { item: statusVal } of statusResults.slice(0, 5)) {
        const count = meetingStatusCounts[statusVal] ?? 0
        items.push({
          id: `meeting-status-${statusVal}`,
          label: statusVal,
          description: `${count} meetings`,
          group: 'meetings',
          action: () => navigate(`/dashboard/meetings?status=${encodeURIComponent(statusVal)}`),
        })
      }

      const meetingFuse = new Fuse(meetings, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'type', weight: 2 },
          { name: 'status', weight: 2 },
          { name: 'rawDate', weight: 1 },
        ],
        threshold: 0.4,
      })
      const meetingResults = meetingFuse.search(query)
      for (const { item: m } of meetingResults.slice(0, 5)) {
        items.push({
          id: `meeting-${m.id}`,
          label: m.title,
          description: `${m.type || m.status} — ${m.date}`,
          group: 'meetings',
          action: () => navigate(`/dashboard/attendance/${m.id}`),
        })
      }

      if (meetingResults.length > 5) {
        const total = meetingResults.length
        items.push({
          id: 'meetings-view-all',
          label: `View all ${total} meetings`,
          description: '',
          group: 'meetings',
          isViewAll: true,
          action: () => navigate(`/dashboard/meetings?search=${encodeURIComponent(query)}`),
        })
      }
    }

    const pages = [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Stewards', to: '/dashboard/stewards' },
      { label: 'Meetings', to: '/dashboard/meetings' },
      { label: 'Attendance', to: '/dashboard/attendance' },
    ]
    for (const page of pages) {
      if (page.label.toLowerCase().includes(queryLower)) {
        items.push({
          id: `page-${page.to}`,
          label: page.label,
          description: page.to,
          group: 'pages',
          action: () => navigate(page.to),
        })
      }
    }

    if (isAdmin) {
      const actions = [
        {
          label: 'Add Steward',
          description: 'Create a new steward record',
          to: '/dashboard/stewards',
        },
        {
          label: 'Create Meeting',
          description: 'Schedule a new meeting',
          to: '/dashboard/meetings',
        },
      ]
      for (const action of actions) {
        if (action.label.toLowerCase().includes(queryLower)) {
          items.push({
            id: `action-${action.label}`,
            label: action.label,
            description: action.description,
            group: 'actions',
            action: () => navigate(action.to),
          })
        }
      }
    }

    return items
  }, [query, stewardSearch.data, meetingsQuery.data, isAuthorized, isAdmin, navigate])

  const isLoading =
    (stewardSearch.isLoading || meetingsQuery.isLoading) && debouncedQuery.length >= 2
  const isError = stewardSearch.isError || meetingsQuery.isError

  return { results, isLoading, isError }
}

export default useGlobalSearch
