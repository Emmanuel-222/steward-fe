export type GraduationStatus = 'on_track' | 'at_risk' | 'will_not_graduate'

export type TrainingCohort = {
  id: number
  name: string
  startDate: string
  weekCount: number
  maxMissedClasses: number
  status: string
  _count?: { enrollments: number; topics?: number }
}

export type CohortListItem = TrainingCohort & {
  topics: Array<{ teacherId: number | null; teacher: { id: number; fullName: string } | null }>
}

export type TrainingTopic = {
  id: number
  cohortId: number
  weekNumber: number
  day: string
  startTime?: string | null
  endTime?: string | null
  title: string
  description?: string | null
  notes?: string | null
  requiredForNew: boolean
  requiredForRefresher: boolean
  teacherId?: number | null
  teacher?: { id: number; fullName: string } | null
}

export type TrainingSession = {
  id: string | number
  meetingId: number | null
  week: number | null
  day: string | null
  topic: string | null
  teacher: string | null
  date: string | null
  startTime: string | null
  endTime: string | null
  location: string | null
  required: boolean
  status: string
}

export type TrainingMe = {
  cohort: {
    id: number
    name: string
    weekCount: number
    maxMissedClasses: number
    track: 'new' | 'refresher'
  }
  currentTopic: { weekNumber: number; title: string; description?: string | null } | null
  nextClass: {
    date: string
    startTime: string
    endTime: string
    location: string
    topic: string | null
    teacher: string | null
  } | null
  missed: number
  graduation: GraduationStatus
}

export type TraineeRow = {
  userId: number
  name: string
  email: string
  track: string
  enrollmentStatus: string
  missed: number
  maxMissedClasses: number
  graduation: GraduationStatus
}

export type TrainingTraineeListItem = {
  userId: number
  name: string
  email: string
  cohortId: number
  cohortName: string
  track: string
  status: string
  missed: number
  maxMissedClasses: number
  graduation: GraduationStatus
}

export type TrainingSessionListItem = {
  classId: number
  cohortId: number
  cohortName: string
  week: number | null
  topic: string | null
  teacher: string | null
  date: string
  startTime: string
  endTime: string
  location: string
}

export type TeachingClass = {
  classId: number
  meetingId: number
  cohortId: number
  cohortName: string
  topic: string | null
  week: number | null
  date: string
  startTime: string
  endTime: string
  location: string
}

export type TeachingResponse = { isTeacher: boolean; classes: TeachingClass[] }

export type RosterEntry = { userId: number; name: string; status: string }

export type ClassRoster = {
  classId: number
  meetingId: number
  cohortName: string
  topic: string | null
  week: number | null
  roster: RosterEntry[]
}
