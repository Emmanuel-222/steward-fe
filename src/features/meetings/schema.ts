import { z } from 'zod'

export const meetingSchema = z.object({
  title: z.string().min(2, 'Meeting title must be at least 2 characters long'),
  date: z.string().min(1, 'Meeting date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  cutoffTime: z.string().min(1, 'Cutoff time is required'),
  location: z.string().min(2, 'Location must be at least 2 characters long'),
})
