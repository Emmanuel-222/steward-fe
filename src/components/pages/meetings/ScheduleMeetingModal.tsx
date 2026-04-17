import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Calendar as CalendarIcon, Info, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { meetingSchema } from '../../../features/meetings/schema'
import type {
  CreateMeetingValues,
  Meeting,
  UpdateMeetingValues,
} from '../../../features/meetings/types'

type BaseProps = {
  open: boolean
  onClose: () => void
  isSubmitting: boolean
}

type ScheduleMeetingModalProps =
  | (BaseProps & {
      mode: 'create'
      onSubmit: (values: CreateMeetingValues) => Promise<void>
      meeting?: null
    })
  | (BaseProps & {
      mode: 'edit'
      onSubmit: (values: UpdateMeetingValues) => Promise<void>
      meeting: Meeting
    })

function ScheduleMeetingModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  mode,
  meeting,
}: ScheduleMeetingModalProps) {
  const [serverError, setServerError] = useState('')

  const schema = mode === 'create' ? meetingSchema : meetingSchema.partial()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMeetingValues | UpdateMeetingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      date: '',
      startTime: '',
      cutoffTime: '',
      endTime: '',
      location: '',
    },
  })

  useEffect(() => {
    if (!open) return

    if (!meeting) {
      reset({
        title: '',
        date: '',
        startTime: '',
        cutoffTime: '',
        endTime: '',
        location: '',
      })
      return
    }

    reset({
      title: meeting.title,
      date: meeting.rawDate,
      startTime: meeting.rawStartTime,
      cutoffTime: meeting.rawCutoffTime,
      endTime: meeting.rawEndTime,
      location: meeting.location === 'Location not set' ? '' : meeting.location,
    })
  }, [meeting, open, reset])

  if (!open) return null

  const handleFormSubmit = async (
    values: CreateMeetingValues | UpdateMeetingValues,
  ) => {
    try {
      setServerError('')

      if (mode === 'create') {
        await (onSubmit as (v: CreateMeetingValues) => Promise<void>)(
          values as CreateMeetingValues,
        )
        onClose()
        return
      }

      if (!meeting) return

      const updatedFields = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => {
          const originalValue = (() => {
            if (key === 'startTime') return meeting.rawStartTime
            if (key === 'cutoffTime') return meeting.rawCutoffTime
            if (key === 'endTime') return meeting.rawEndTime
            if (key === 'date') return meeting.rawDate
            if (key === 'location') {
              return meeting.location === 'Location not set' ? '' : meeting.location
            }

            return meeting[key as keyof Meeting]
          })()

          return value !== originalValue
        }),
      )

      if (Object.keys(updatedFields).length === 0) {
        onClose()
        return
      }

      await (onSubmit as (v: UpdateMeetingValues) => Promise<void>)(
        updatedFields as UpdateMeetingValues,
      )

      onClose()
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        setServerError(
          error.response?.data?.message ?? 'Unable to save meeting right now.',
        )
        return
      }

      setServerError('Unable to save meeting right now.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 px-4 py-4 backdrop-blur-[2px] sm:px-6 sm:py-6"
      onClick={onClose}
    >
      <div
        className="mx-auto my-4 w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:my-8 sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-meeting-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="schedule-meeting-title"
              className="text-xl font-semibold text-[#0f2d52]"
            >
              {mode === 'create' ? 'Schedule New Meeting' : 'Edit Meeting'}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {mode === 'create'
                ? 'Define the parameters for the new registrar session.'
                : 'Update the details for this registrar session.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close schedule meeting dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {serverError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </p>
          ) : null}

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Meeting Title
            </span>
            <input
              type="text"
              className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              placeholder="e.g. Sunday Service"
              {...register('title')}
            />
            {errors.title ? (
              <p className="text-sm text-rose-600">{errors.title.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Date
            </span>
            <div className="relative">
              <input
                type="date"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                {...register('date')}
              />
              <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
            {errors.date ? (
              <p className="text-sm text-rose-600">{errors.date.message}</p>
            ) : null}
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Start Time
              </span>
              <input
                type="time"
                step="60"
                className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                {...register('startTime')}
              />
              {errors.startTime ? (
                <p className="text-sm text-rose-600">
                  {errors.startTime.message}
                </p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Cutoff Time (Late Limit)
              </span>
              <input
                type="time"
                step="60"
                className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                {...register('cutoffTime')}
              />
              {errors.cutoffTime ? (
                <p className="text-sm text-rose-600">
                  {errors.cutoffTime.message}
                </p>
              ) : null}
            </label>

            <label className="block space-y-2 sm:col-span-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                End Time
              </span>
              <input
                type="time"
                step="60"
                className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                {...register('endTime')}
              />
              {errors.endTime ? (
                <p className="text-sm text-rose-600">{errors.endTime.message}</p>
              ) : null}
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Location
            </span>
            <input
              type="text"
              className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              placeholder="e.g. Main Sanctuary"
              {...register('location')}
            />
            {errors.location ? (
              <p className="text-sm text-rose-600">{errors.location.message}</p>
            ) : null}
          </label>

          <div className="flex gap-3 rounded-xl bg-[#f3f7fd] px-4 py-3 text-xs leading-5 text-slate-500">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5d74a2]" />
            <p>
              Attendance is tracked after the meeting ends. Members arriving
              after the cutoff time will be marked as late.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#0f2d52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173c67] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'create'
                  ? 'Create Meeting'
                  : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleMeetingModal
