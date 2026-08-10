import { KeyRound, Loader2, MailCheck, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import useSendVerificationCode from '../features/auth/hooks/useSendVerificationCode'
import useCompleteOnboarding from '../features/auth/hooks/useCompleteOnboarding'
import PasswordRequirements, { PASSWORD_POLICY_ERROR, PASSWORD_POLICY_REGEX } from '../components/ui/PasswordRequirements'

function OnboardingPage() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const sendCodeMutation = useSendVerificationCode()
  const completeMutation = useCompleteOnboarding()

  const onboarding = user?.onboarding
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const [codeSent, setCodeSent] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  if (!isAuthenticated) return <Navigate to="/" replace />

  const needsEmailVerify = onboarding?.needsEmailVerify ?? false

  const handleSendCode = async () => {
    setError('')
    try {
      await sendCodeMutation.mutateAsync()
      setCodeSent(true)
      setCountdown(30)
      showToast('Verification code sent to your email', 'info')
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      setError(message ?? 'Unable to send the code right now.')
    }
  }

  const handleComplete = async () => {
    setError('')
    if (needsEmailVerify && !/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    if (!PASSWORD_POLICY_REGEX.test(password)) {
      setError(PASSWORD_POLICY_ERROR)
      return
    }
    if (password.toLowerCase() === 'steward@123') {
      setError('Password cannot be the default password.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      await completeMutation.mutateAsync({
        code: needsEmailVerify ? code : undefined,
        newPassword: password,
      })
      showToast('Account ready — you can now use the app', 'success')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      setError(message ?? 'Unable to complete setup right now.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5efe6] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.15)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand">
              Finish Setting Up
            </h1>
            <p className="text-sm text-slate-500">One step and you're in.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f8fbff] p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="mt-0.5 text-slate-500">{user?.email}</p>
        </div>

        <div className="mt-6 space-y-4">
          {needsEmailVerify && (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Verify Your Email
              </p>
              {!codeSent ? (
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendCodeMutation.isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:opacity-70"
                >
                  <MailCheck className="h-4 w-4" />
                  {sendCodeMutation.isPending ? 'Sending...' : 'Send Code'}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 text-sm tracking-widest text-slate-700 outline-none transition focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || sendCodeMutation.isPending}
                    className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    {countdown > 0 ? `${countdown}s` : 'Resend'}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Set Your Password
            </p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-12 text-sm text-slate-700 outline-none transition focus:border-brand"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <PasswordRequirements password={password} />
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="h-11 w-full rounded-xl border border-[#d8e2f0] bg-[#f3f7fd] px-4 pr-12 text-sm text-slate-700 outline-none transition focus:border-brand"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleComplete}
            disabled={completeMutation.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            <KeyRound className="h-4 w-4" />
            {completeMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Verify &amp; Set Password
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage