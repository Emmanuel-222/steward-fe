import { z } from 'zod'

export const meetingTypeOptions = ['Sunday', 'Special', 'Prayer Meeting'] as const

const validMeetingTypes = meetingTypeOptions as readonly string[]

export const meetingSchema = z.object({
  title: z.string().min(2, 'Meeting title must be at least 2 characters long'),
  type: z.string().refine(
    (val) => validMeetingTypes.includes(val),
    'Select a valid meeting type',
  ),
  date: z.string().min(1, 'Meeting date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  cutoffTime: z.string().min(1, 'Cutoff time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(2, 'Location must be at least 2 characters long'),
}).superRefine((data, ctx) => {
  if (data.startTime && data.cutoffTime && data.cutoffTime <= data.startTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cutoff time must be after start time',
      path: ['cutoffTime'],
    })
  }
})
