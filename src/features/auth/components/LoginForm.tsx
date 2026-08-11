import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Clock, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import useLoginMutation from '../hooks/useLoginMutation'
import { loginSchema } from '../schema'
import type { LoginPayload } from '../types'

function formatCooldown(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

const STORAGE_KEY = 'rateLimitResetAt'

function getPersistedCooldown(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return 0
    const remaining = Math.round((Number(stored) - Date.now()) / 1000)
    if (remaining <= 0) {
      localStorage.removeItem(STORAGE_KEY)
      return 0
    }
    return remaining
  } catch {
    return 0
  }
}

function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [cooldown, setCooldown] = useState(getPersistedCooldown)
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

  useEffect(() => {
    if (cooldown <= 0) return

    const id = setInterval(() => {
      setCooldown((prev) => {
        const next = prev - 1
        if (next <= 0) {
          localStorage.removeItem(STORAGE_KEY)
          setServerError('')
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(id)
  }, [cooldown])

  const isRateLimited = cooldown > 0

  const onSubmit = async (values: LoginPayload) => {
    try {
      setServerError('')
      await loginMutation.mutateAsync(values)
      navigate('/dashboard')
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const status = error.response.status
        const message = error.response.data?.message

        if (status === 429) {
          // eslint-disable-next-line react-hooks/purity
          const now = Date.now()
          const resetHeader = error.response.headers['rateLimit-Reset']
          let resetAt: number
          if (resetHeader) {
            resetAt = Number(resetHeader) * 1000
          } else {
            resetAt = now + 15 * 60 * 1000
          }
          localStorage.setItem(STORAGE_KEY, String(resetAt))
          const remaining = Math.max(1, Math.round((resetAt - now) / 1000))
          setCooldown(remaining)
          return
        }

        setServerError(
          message ?? 'Authentication failed. Please verify your email and password.',
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
      <div className="space-y-2 animate-stagger-fade" style={{ animationDelay: '0ms' }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-signature">
          Attendance Management
        </p>
        <h2 className="font-serif text-[2rem] font-semibold tracking-tight text-brand">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500">
          Please enter your registrar credentials to continue.
        </p>
        <div className="h-px w-12 bg-signature" />
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {isRateLimited ? (
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white">
              <ShieldAlert className="h-3 w-3" />
            </div>
            <div className="leading-6">
              <p className="font-semibold">Too many login attempts</p>
              <p className="mt-0.5 text-amber-700">
                Try again in <span className="font-bold">{formatCooldown(cooldown)}</span>
              </p>
            </div>
          </div>
        ) : serverError ? (
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

        <label className="block space-y-2 animate-stagger-fade" style={{ animationDelay: '200ms' }}>
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

        <label className="block space-y-2 animate-stagger-fade" style={{ animationDelay: '400ms' }}>
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

        <div className="animate-stagger-fade" style={{ animationDelay: '600ms' }}>
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loginMutation.isPending || isRateLimited}
          >
            {isRateLimited ? (
              <>
                <Clock className="h-4 w-4" />
                <span>Wait {formatCooldown(cooldown)}</span>
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-start justify-between gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center">
        <span>&copy; 2026 Steward Attendance Management.</span>
        <span>Privacy Policy &amp; Security Protocol</span>
      </div>
    </div>
  )
}

export default LoginForm
