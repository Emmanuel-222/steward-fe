import {
  Calendar as CalendarIcon,
  Clock3,
  Info,
  X,
} from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { meetingSchema } from '../../../features/meetings/schema'
import type { CreateMeetingValues, Meeting, UpdateMeetingValues } from '../../../features/meetings/types'

type ScheduleMeetingModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: CreateMeetingValues | UpdateMeetingValues) => Promise<void>
  isSubmitting: boolean
  mode?: 'create' | 'edit'
  meeting?: Meeting | null
}

function ScheduleMeetingModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  mode = 'create',
  meeting = null,
}: ScheduleMeetingModalProps) {
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMeetingValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: '',
      date: '',
      startTime: '',
      cutoffTime: '',
      location: '',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }

    if (!meeting) {
      reset({
        title: '',
        date: '',
        startTime: '',
        cutoffTime: '',
        location: '',
      })
      return
    }

    const [startTime = '', cutoffTime = ''] = meeting.time.split(' - ')
    reset({
      title: meeting.title,
      date: meeting.date === 'N/A' ? '' : meeting.date,
      startTime,
      cutoffTime,
      location: meeting.location === 'Location not set' ? '' : meeting.location,
    })
  }, [meeting, open, reset])

  if (!open) {
    return null
  }

  const handleFormSubmit = async (values: CreateMeetingValues) => {
    try {
      setServerError('')
      await onSubmit(values)
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:p-6"
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

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Start Time
              </span>
              <div className="relative">
                <input
                  type="time"
                  className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                  {...register('startTime')}
                />
                <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
              {errors.startTime ? (
                <p className="text-sm text-rose-600">{errors.startTime.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Cutoff Time
              </span>
              <div className="relative">
                <input
                  type="time"
                  className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                  {...register('cutoffTime')}
                />
                <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
              {errors.cutoffTime ? (
                <p className="text-sm text-rose-600">{errors.cutoffTime.message}</p>
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
              Attendance will be marked as Absent automatically after the cutoff
              time of 09:30 AM.
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
