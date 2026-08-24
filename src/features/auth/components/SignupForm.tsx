import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { ChevronDown, Eye, EyeOff, MailCheck } from 'lucide-react'
import useSignupMutation from '../hooks/useSignupMutation'
import { signupSchema } from '../schema'
import type { SignupFormValues } from '../types'
import { DEPARTMENTS } from '../../../constants/departments'
import PasswordRequirements from '../../../components/ui/PasswordRequirements'

function SignupForm() {
  const signupMutation = useSignupMutation()
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setServerError('')
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        department: values.department,
        password: values.password,
      }
      await signupMutation.mutateAsync(payload)
      setSubmittedEmail(values.email)
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error) && error.response) {
        setServerError(
          error.response.data?.message ?? 'Unable to create your account right now.',
        )
        return
      }
      setServerError('Unable to create your account right now.')
    }
  }

  if (submittedEmail) {
    return (
      <div className="mx-auto w-full max-w-md text-center animate-stagger-fade">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 border border-sky-100">
          <MailCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-6 font-serif text-2xl font-semibold tracking-tight text-brand">
          Check your email
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          We&apos;ve sent a verification link to{' '}
          <span className="font-semibold text-slate-700">{submittedEmail}</span>.
          Click the link to verify your account, then come back to log in.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-2 animate-stagger-fade" style={{ animationDelay: '0ms' }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-signature">
          Attendance Management
        </p>
        <h2 className="font-serif text-[2rem] font-semibold tracking-tight text-brand">
          Create Your Account
        </h2>
        <p className="text-sm text-slate-500">
          Register as a steward to start marking your attendance.
        </p>
        <div className="h-px w-12 bg-signature" />
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError ? (
          <div className="flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
              <svg
                aria-hidden="true"
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M12 8v5" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <p className="leading-6">{serverError}</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              First name
            </span>
            <input
              type="text"
              placeholder="Julian"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-brand placeholder:text-slate-400"
              {...register('firstName')}
            />
            {errors.firstName ? (
              <p className="text-sm text-rose-600">{errors.firstName.message}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Last name
            </span>
            <input
              type="text"
              placeholder="Pierce"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-brand placeholder:text-slate-400"
              {...register('lastName')}
            />
            {errors.lastName ? (
              <p className="text-sm text-rose-600">{errors.lastName.message}</p>
            ) : null}
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Email address
          </span>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-signature/30">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <input
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
          </div>
          {errors.email ? (
            <p className="text-sm text-rose-600">{errors.email.message}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Department
          </span>
          <div className="relative">
            <select
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-brand"
              {...register('department')}
              defaultValue=""
            >
              <option value="" disabled>
                Select Department
              </option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.department ? (
            <p className="text-sm text-rose-600">{errors.department.message}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Password
          </span>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-signature/30">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>
            <input
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a secure password"
              {...register('password')}
            />
            <button
              type="button"
              className="text-slate-400 transition hover:text-slate-600"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordRequirements password={watch('password')} />
          {errors.password ? (
            <p className="text-sm text-rose-600">{errors.password.message}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Confirm password
          </span>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 focus-within:border-brand focus-within:ring-2 focus-within:ring-signature/30">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 1 1 8 0v3" />
            </svg>
            <input
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="text-slate-400 transition hover:text-slate-600"
              onClick={() => setShowConfirm((current) => !current)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="text-sm text-rose-600">{errors.confirmPassword.message}</p>
          ) : null}
        </label>

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={signupMutation.isPending}
        >
          <span>{signupMutation.isPending ? 'Creating account...' : 'Create Account'}</span>
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/" className="font-semibold text-brand hover:text-brand-hover">
          Log in
        </Link>
      </p>
    </div>
  )
}

export default SignupForm
