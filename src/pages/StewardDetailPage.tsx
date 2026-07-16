import { useNavigate, useParams } from 'react-router-dom'
import StewardProfileView from '../components/pages/stewards/StewardProfileView'
import { useStewardDetailQuery } from '../features/stewards/hooks/useStewardsQuery'
import { useState } from 'react'
import EditUserModal from '../components/pages/stewards/EditUserModal'
import useUpdateStewardMutation from '../features/stewards/hooks/useUpdateStewardMutation'
import useAuth from '../hooks/useAuth'
import useMeQuery from '../features/auth/hooks/useMeQuery'
import { useToast } from '../hooks/useToast'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import type { UpdateStewardValues } from '../features/stewards/types'

function StewardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const meQuery = useMeQuery(!user && isAuthenticated)
  const currentUser = user || meQuery.data
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const role = currentUser?.role?.toLowerCase()
  const isAuthorized = role === 'admin' || role === 'leader' || role === 'pastor'
  
  const detailQuery = useStewardDetailQuery(id ?? null)
  const updateStewardMutation = useUpdateStewardMutation()

  if (isAuthenticated && !currentUser) {
    return (
      <div className="flex h-64 items-center justify-center rounded-card border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        <p className="text-sm text-slate-500">Checking credentials...</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-card border border-slate-200 bg-white px-6 py-24 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <h3 className="text-2xl font-bold tracking-tight text-brand">Access Restricted</h3>
        <p className="text-slate-500 font-medium max-w-md">
          You don't have permission to view personnel profiles.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-[0_15px_40px_rgba(15,45,82,0.2)] transition hover:bg-brand-hover"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  if (detailQuery.isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-card border border-slate-200 bg-white p-6">
            <Skeleton className="mb-4 h-5 w-32" />
            <Skeleton className="mb-2 h-4 w-48" />
            <Skeleton className="mb-2 h-4 w-36" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="rounded-card border border-slate-200 bg-white p-6">
            <Skeleton className="mb-3 h-4 w-20" />
            <Skeleton className="mb-2 h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <ErrorState
        message="Unable to load steward record."
        onRetry={() => detailQuery.refetch()}
      />
    )
  }

  const steward = detailQuery.data

  const handleUpdateSteward = async (values: UpdateStewardValues) => {
    try {
      await updateStewardMutation.mutateAsync({
        id: steward.id,
        payload: values,
      })
      showToast('Profile updated successfully', 'success')
      setIsEditModalOpen(false)
    } catch {
      showToast('Failed to update record', 'error')
    }
  }

  return (
    <div className="space-y-8">
      <div className="animate-stagger-fade" style={{ animationDelay: '0ms' }}>
        <StewardProfileView
          stewardId={steward.id}
          initialSteward={steward}
          onBack={() => navigate('/dashboard/stewards')}
          onEdit={() => setIsEditModalOpen(true)}
        />
      </div>

      <EditUserModal
        steward={steward}
        open={isEditModalOpen}
        onSubmit={handleUpdateSteward}
        isSubmitting={updateStewardMutation.isPending}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}

export default StewardDetailPage


