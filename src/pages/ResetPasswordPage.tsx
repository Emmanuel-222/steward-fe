import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import api from '../services/axios'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsPending(true)
    try {
      await api.post('/auth/reset-password', { token, newPassword })
      setIsSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setIsPending(false)
    }
  }

  if (!token) {
    return (
    <main className="flex min-h-dvh items-center justify-center bg-page-bg px-4 py-12">
        <div className="w-full max-w-md rounded-card border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100">
            <KeyRound className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">Invalid link</h1>
          <p className="mb-8 text-sm text-slate-500">
            This reset link is invalid or missing a token. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand/90"
          >
            Request new link
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-page-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-card border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          {isSuccess ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-slate-800">Password reset</h1>
              <p className="mb-8 text-sm text-slate-500">
                Your password has been updated. You can now log in with your new password.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10">
                  <KeyRound className="h-8 w-8 text-brand" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-slate-800">Set new password</h1>
                <p className="text-sm text-slate-500">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      autoFocus
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      tabIndex={-1}
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                      placeholder="Re-enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-xs text-rose-500">Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <p className="rounded-xl bg-rose-50 p-3 text-center text-sm font-medium text-rose-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand/90 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                  {isPending ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/" className="text-sm font-medium text-brand hover:underline">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default ResetPasswordPage
