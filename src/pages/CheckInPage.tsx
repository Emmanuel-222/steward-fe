import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCheckInMutation from '../features/checkin/hooks/useCheckInMutation'

type PageState =
  | { status: 'form' }
  | { status: 'loading' }
  | { status: 'success'; name: string }

function DiamondRule() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-signature/30" />
      <span className="text-[7px] leading-none tracking-[0.15em] text-signature/50">
        ◆
      </span>
      <span className="h-[1px] flex-1 bg-gradient-to-r from-signature/30 to-transparent" />
    </div>
  )
}

function CheckInPage() {
  const { token } = useParams<{ token: string }>()
  const [email, setEmail] = useState('')
  const [pageState, setPageState] = useState<PageState>({ status: 'form' })
  const [error, setError] = useState<string | null>(null)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const checkInMutation = useCheckInMutation()

  useEffect(() => {
    if (!token) {
      setError('This check-in link is not valid.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !email.trim()) return

    setError(null)
    setIsDuplicate(false)
    setPageState({ status: 'loading' })

    try {
      const result = await checkInMutation.mutateAsync({
        token,
        email: email.trim(),
      })
      setIsDuplicate(result.isDuplicate ?? false)
      setPageState({ status: 'success', name: result.stewardName })
    } catch (err: unknown) {
      const message: string =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response: { data: { message?: string } } }).response.data
              ?.message ?? 'Could not reach the server. Check your connection.'
          : 'Could not reach the server. Check your connection.'
      setError(message)
      setPageState({ status: 'form' })
    }
  }

  const showForm = pageState.status === 'form'
  const showLoading = pageState.status === 'loading'
  const showSuccess = pageState.status === 'success'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-4 py-10">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-b from-amber-50/60 to-white px-7 pb-2 pt-9">
            <h1 className="font-serif text-[28px] font-semibold leading-tight tracking-tight text-brand">
              Registration
            </h1>
            <p className="mt-1.5 font-sans text-[13px] font-normal leading-snug text-slate-500">
              Enter your email to sign in.
            </p>

            <div className="mt-5">
              <DiamondRule />
            </div>
          </div>

          <div className="px-7 pb-9 pt-5">
            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-center font-sans text-[13px] font-medium text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    placeholder="you@email.com"
                    autoFocus
                    autoComplete="email"
                    spellCheck={false}
                    className="font-sans block w-full border-0 border-b border-slate-200 bg-transparent px-0 pb-3 pt-0 text-[15px] font-normal text-slate-900 placeholder:text-slate-300 focus:border-signature focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={checkInMutation.isPending || !email.trim()}
                  className="font-sans w-full rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,45,82,0.18)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_18px_40px_rgba(15,45,82,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:shadow-[0_12px_30px_rgba(15,45,82,0.18)]"
                >
                  Sign the Register
                </button>
              </form>
            )}

            {showLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
              </div>
            )}

            {showSuccess && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-full animate-scale-in ${isDuplicate ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                  {isDuplicate ? (
                    <svg viewBox="0 0 24 24" className="h-7 w-7 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <p className="font-serif text-[22px] font-semibold leading-tight text-brand">
                  {isDuplicate ? 'Already checked in' : `Welcome, ${pageState.name}`}
                </p>
                <p className="font-sans text-[13px] text-slate-500">
                  {isDuplicate ? `You were already checked in, ${pageState.name}.` : "You're signed in."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="h-px w-6 bg-slate-200" />
          <span className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400">
            The Registrar
          </span>
          <span className="h-px w-6 bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

export default CheckInPage
