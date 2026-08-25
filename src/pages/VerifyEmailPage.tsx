import { isAxiosError } from 'axios'
import { CheckCircle2, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useVerifyEmailMutation from '../features/auth/hooks/useVerifyEmailMutation'
import { useToast } from '../hooks/useToast'

const REDIRECT_DELAY_MS = 1800

function VerifyEmailPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const verifyMutation = useVerifyEmailMutation()
  const hasRun = useRef(false)

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token || hasRun.current) return
    hasRun.current = true

    verifyMutation.mutate(token, {
      onSuccess: () => {
        setStatus('success')
        showToast('Email verified — you can now log in', 'success')
        setTimeout(() => navigate('/', { replace: true }), REDIRECT_DELAY_MS)
      },
      onError: (error) => {
        setStatus('error')
        const message =
          isAxiosError<{ message?: string }>(error) && error.response
            ? error.response.data?.message
            : undefined
        setErrorMessage(message ?? 'This verification link is invalid or has expired.')
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5efe6] px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_28px_80px_rgba(15,23,42,0.15)]">
        {status === 'verifying' ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand">
              Verifying your email
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Hang tight, this only takes a moment.
            </p>
          </>
        ) : null}

        {status === 'success' ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand">
              Email verified
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Taking you to the login page...
            </p>
          </>
        ) : null}

        {status === 'error' ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 border border-rose-100">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-brand">
              Verification failed
            </h1>
            <p className="mt-2 text-sm text-slate-500">{errorMessage}</p>
            <Link
              to="/"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              <ShieldCheck className="h-4 w-4" />
              Back to Login
            </Link>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default VerifyEmailPage
