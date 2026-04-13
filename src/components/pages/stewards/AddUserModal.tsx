import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { ChevronDown, Eye, EyeOff, Info, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createStewardSchema, stewardRoleOptions } from '../../../features/stewards/schema'
import type { CreateStewardValues } from '../../../features/stewards/types'

type AddUserModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (values: CreateStewardValues) => Promise<void>
  isSubmitting: boolean
}

function AddUserModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: AddUserModalProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStewardValues>({
    resolver: zodResolver(createStewardSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      department: '',
      role: 'Steward',
    },
  })

  if (!open) {
    return null
  }

  const handleFormSubmit = async (values: CreateStewardValues) => {
    try {
      setServerError('')
      await onSubmit(values)
      reset()
      onClose()
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        setServerError(
          error.response?.data?.message ?? 'Unable to add user right now.',
        )
        return
      }

      setServerError('Unable to add user right now.')
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
        aria-labelledby="add-user-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="add-user-title" className="text-xl font-semibold text-[#0f2d52]">
              Add New User
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Enrol a new member into the digital registry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close add user dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          noValidate
          className="mt-5 space-y-4 sm:mt-6"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          {serverError ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Full Name
              </span>
              <input
                type="text"
                placeholder="e.g. Julian Pierce"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
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
                placeholder="name@steward.org"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
                {...register('email')}
              />
              {errors.email ? (
                <p className="text-sm text-rose-600">{errors.email.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Phone Number
              </span>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
                {...register('phone')}
              />
              {errors.phone ? (
                <p className="text-sm text-rose-600">{errors.phone.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Security Password
              </span>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-sm text-rose-600">{errors.password.message}</p>
              ) : null}
            </label>

            <label className="block space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Department
              </span>
              <input
                type="text"
                placeholder="e.g. Hospitality"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm text-slate-700 outline-none transition focus:border-[#0f2d52] placeholder:text-slate-400"
                {...register('department')}
              />
              {errors.department ? (
                <p className="text-sm text-rose-600">{errors.department.message}</p>
              ) : null}
            </label>

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
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-[#f3f7fd] px-4 py-3 text-xs leading-5 text-slate-500">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5d74a2]" />
            <p>
              Newly added users will receive an automated invitation email to
              verify their identity and finalize their secure access profile.
            </p>
          </div>

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
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal
