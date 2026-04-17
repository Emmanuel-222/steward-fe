export type Meeting = {
  id: string
  status: string
  statusTone: string
  title: string
  subtitle: string
  date: string
  time: string
  location: string
  present: number | null
  absent: number | null
  primaryAction: string
  secondaryAction: string
  rawDate: string
  rawStartTime: string
  rawCutoffTime: string
  rawEndTime: string
}

export type CreateMeetingValues = {
  title: string
  date: string
  startTime: string
  cutoffTime: string
  endTime: string
  location: string
}

export type UpdateMeetingValues = Partial<CreateMeetingValues>
