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

export type StewardAttendanceSummary = {
  total: number
  present: number
  absent: number
}

export type StewardAttendanceRecord = {
  id: string
  date: string
  meeting: string
  status: string
  time: string
}

export type StewardAttendanceReport = {
  user: Steward
  summary: StewardAttendanceSummary
  records: StewardAttendanceRecord[]
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
