import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

type RoleGuardProps = {
  allow: string[]
  children: ReactNode
}

function RoleGuard({ allow, children }: RoleGuardProps) {
  const { user } = useAuth()
  const role = user?.role?.toLowerCase()

  if (!role || allow.includes(role)) return <>{children}</>

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-xl font-semibold text-brand">No access</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your role ({role}) doesn&apos;t have access to this area.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
      >
        Back to dashboard
      </Link>
    </div>
  )
}

export default RoleGuard
