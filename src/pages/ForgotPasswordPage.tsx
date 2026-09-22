import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react'
import api from '../services/axios'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsPending(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setIsSuccess(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setIsPending(false)
    }
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
              <h1 className="mb-2 text-2xl font-bold text-slate-800">Check your email</h1>
              <p className="mb-8 text-sm text-slate-500">
                If an account exists with <span className="font-semibold">{email}</span>, we've sent a password reset link.
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
                  <Mail className="h-8 w-8 text-brand" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-slate-800">Forgot password?</h1>
                <p className="text-sm text-slate-500">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <p className="rounded-xl bg-rose-50 p-3 text-center text-sm font-medium text-rose-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand/90 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  {isPending ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPasswordPage
