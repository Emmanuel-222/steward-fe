import { z } from 'zod'

export const meetingTypeOptions = ['Sunday', 'Special', 'Prayer Meeting', 'Bible study'] as const

const validMeetingTypes = meetingTypeOptions as readonly string[]

const meetingBaseSchema = z.object({
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
})

const cutoffTimeRefine = (
  data: { startTime?: string; cutoffTime?: string },
  ctx: { addIssue: (issue: { code: typeof z.ZodIssueCode.custom; message: string; path: [string] }) => void },
) => {
  if (data.startTime && data.cutoffTime && data.cutoffTime <= data.startTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cutoff time must be after start time',
      path: ['cutoffTime'],
    })
  }
}

export const meetingSchema = meetingBaseSchema.superRefine(cutoffTimeRefine)

export const updateMeetingSchema = meetingBaseSchema
  .partial()
  .superRefine(cutoffTimeRefine)
