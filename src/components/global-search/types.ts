export type SearchGroup = 'stewards' | 'departments' | 'meetings' | 'pages' | 'actions'

export type SearchResultItem = {
  id: string
  label: string
  description: string
  image?: string
  group: SearchGroup
  isViewAll?: boolean
  action: () => void
}

export type RecentSearch = {
  query: string
  timestamp: number
}
