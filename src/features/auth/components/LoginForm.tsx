import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import useLoginMutation from '../hooks/useLoginMutation'
import { loginSchema } from '../schema'
import type { LoginPayload } from '../types'

function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginPayload) => {
    try {
      setServerError('')
      await loginMutation.mutateAsync(values)
      navigate('/dashboard')
    } catch (error) {
      if (isAxiosError<{ message?: string }>(error)) {
        setServerError(
          error.response?.data?.message ??
            'Authentication failed. Please verify your email and password.',
        )
        return
      }

      setServerError(
        'Authentication failed. Please verify your email and password.',
      )
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-2">
        <h2 className="text-[2rem] font-semibold tracking-tight text-slate-900">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500">
          Please enter your registrar credentials to continue.
        </p>
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

        <label className="block space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Email address
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 transition focus-within:border-slate-400 focus-within:bg-white">
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
              placeholder="admin@stewardregistry.org"
              {...register('email')}
            />
          </div>

          {errors.email ? (
            <p className="text-sm text-rose-600">{errors.email.message}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Password
            </span>
            <button
              className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
              type="button"
            >
              Forgot?
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 transition focus-within:border-slate-400 focus-within:bg-white">
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
              placeholder="Enter your password"
              {...register('password')}
            />
            <button
              type="button"
              className="text-slate-400 transition hover:text-slate-600"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
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

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d2f57] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#133a6a] disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={loginMutation.isPending}
        >
          <span>
            {loginMutation.isPending ? 'Authenticating...' : 'Access Registry'}
          </span>
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

      <div className="mt-8 flex items-center justify-between gap-4 text-[11px] text-slate-400">
        <span>&copy; 2024 Steward Attendance Management.</span>
        <span>Privacy Policy &amp; Security Protocol</span>
      </div>
    </div>
  )
}

export default LoginForm
