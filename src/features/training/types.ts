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
  title: string
  description?: string | null
  notes?: string | null
  teacherId?: number | null
  teacher?: { id: number; fullName: string } | null
}

export type TrainingClassItem = {
  id: string | number
  meetingId: number
  date: string
  startTime: string
  endTime: string
  location: string
  topic: string | null
  week: number | null
  status: string
}

export type TrainingMe = {
  cohort: {
    id: number
    name: string
    weekCount: number
    teacher: string | null
    maxMissedClasses: number
  }
  currentTopic: TrainingTopic | null
  nextClass: {
    date: string
    startTime: string
    endTime: string
    location: string
    topic: string | null
  } | null
  missed: number
  graduation: GraduationStatus
}

export type TraineeRow = {
  userId: number
  name: string
  email: string
  enrollmentStatus: string
  missed: number
  maxMissedClasses: number
  graduation: GraduationStatus
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
