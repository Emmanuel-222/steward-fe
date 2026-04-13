import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { ChevronDown, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { stewardRoleOptions, updateStewardSchema } from '../../../features/stewards/schema'
import type { Steward, CreateStewardValues, UpdateStewardValues } from '../../../features/stewards/types'

type EditUserModalProps = {
  steward: Steward | null
  open: boolean
  onClose: () => void
  onSubmit: (values: UpdateStewardValues) => Promise<void>
  isSubmitting: boolean
}

function EditUserModal({
  steward,
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: EditUserModalProps) {
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStewardValues>({
    resolver: zodResolver(updateStewardSchema),
  })

  useEffect(() => {
    if (!steward) {
      return
    }

    reset({
      name: steward.name,
      email: steward.email,
      phone: steward.phone === 'N/A' ? '' : steward.phone,
      department: steward.department as CreateStewardValues['department'],
      role: steward.role as CreateStewardValues['role'],
    })
  }, [reset, steward])

  if (!open || !steward) {
    return null
  }

  const handleFormSubmit = async (
    values: UpdateStewardValues,
  ) => {
    try {
      setServerError('')
      await onSubmit(values)
      onClose()
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        setServerError(
          error.response?.data?.message ?? 'Unable to update user right now.',
        )
        return
      }

      setServerError('Unable to update user right now.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 px-3 py-4 backdrop-blur-[2px] sm:px-4 sm:py-6"
      onClick={onClose}
    >
      <div
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-[0_28px_80px_rgba(15,23,42,0.24)] sm:max-h-[calc(100vh-3rem)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="edit-user-title" className="text-xl font-semibold text-[#0f2d52]">
              Edit User Profile
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Update the details and system permissions for this member.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close edit user dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[#f8fbff] p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0f2d52] text-base font-semibold text-white">
            {steward.initials}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Member Status
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active Steward
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          {serverError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </p>
          ) : null}

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Full Name
            </span>
            <input
              type="text"
              className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              {...register('name')}
            />
            {errors.name ? (
              <p className="text-sm text-rose-600">{errors.name.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Email Address
            </span>
            <input
              type="email"
              className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
              {...register('email')}
            />
            {errors.email ? (
              <p className="text-sm text-rose-600">{errors.email.message}</p>
            ) : null}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phone Number
              </span>
              <input
                type="tel"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                {...register('phone')}
              />
              {errors.phone ? (
                <p className="text-sm text-rose-600">{errors.phone.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Department
              </span>
              <input
                type="text"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                {...register('department')}
              />
              {errors.department ? (
                <p className="text-sm text-rose-600">{errors.department.message}</p>
              ) : null}
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              System Role
            </span>
            <div className="relative">
              <select
                className="h-11 w-full appearance-none rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52]"
                {...register('role')}
              >
                {stewardRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            {errors.role ? (
              <p className="text-sm text-rose-600">{errors.role.message}</p>
            ) : null}
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#0f2d52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173c67] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserModal
