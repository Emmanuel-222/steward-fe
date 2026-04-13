export type StewardRole = 'Steward' | 'Leader' | 'Pastor' | 'Admin'

export type Steward = {
  id: string
  initials: string
  name: string
  email: string
  department: string
  role: string
  roleTone: string
  phone: string
  dateAdded: string
}

export type CreateStewardValues = {
  name: string
  email: string
  phone: string
  password: string
  department: string
  role: StewardRole
}

export type UpdateStewardValues = Omit<CreateStewardValues, 'password'>

export type StewardsResponse = {
  users?: unknown[]
  data?: unknown[]
  results?: unknown[]
}
