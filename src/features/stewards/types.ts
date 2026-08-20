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
  birthday?: string
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
  birthday?: string
}

export type UpdateStewardValues = Omit<CreateStewardValues, 'password'>

export type ImportFailure = {
  row: number
  field: string
  message: string
}

export type ImportCorrection = {
  row: number
  field: string
  from: string
  to: string
}

export type ImportResult = {
  imported: number
  skipped: number
  defaultPassword: string
  failures: ImportFailure[]
  corrections: ImportCorrection[]
}

export type StewardsResponse = {
  items?: unknown[]
  users?: unknown[]
  data?: unknown[]
  results?: unknown[]
}
