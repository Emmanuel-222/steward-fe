import { useNavigate, useParams } from 'react-router-dom'
import StewardProfileView from '../components/pages/stewards/StewardProfileView'
import { useStewardDetailQuery } from '../features/stewards/hooks/useStewardsQuery'
import { useState } from 'react'
import EditUserModal from '../components/pages/stewards/EditUserModal'
import useUpdateStewardMutation from '../features/stewards/hooks/useUpdateStewardMutation'
import useAuth from '../hooks/useAuth'
import useMeQuery from '../features/auth/hooks/useMeQuery'
import { useToast } from '../hooks/useToast'
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
      <div className="flex h-64 items-center justify-center rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        <p className="text-sm text-slate-500">Checking credentials...</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-[35px] border border-slate-200 bg-white px-6 py-24 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <h3 className="text-2xl font-bold tracking-tight text-[#0f2d52]">Access Restricted</h3>
        <p className="text-slate-500 font-medium max-w-md">
          You don't have permission to view personnel profiles.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center justify-center rounded-2xl bg-[#0f2d52] px-8 py-4 text-sm font-bold text-white shadow-[0_15px_40px_rgba(15,45,82,0.2)] transition hover:bg-[#173c67]"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  if (detailQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        <p className="text-sm text-slate-500">Loading steward record...</p>
      </div>
    )
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[30px] border border-rose-100 bg-rose-50 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-medium text-rose-600">Personnel record not found.</p>
        <button 
          onClick={() => navigate('/dashboard/stewards')}
          className="text-xs font-semibold uppercase tracking-wider text-rose-700 underline"
        >
          Return to Registry
        </button>
      </div>
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
    } catch (error) {
      showToast('Failed to update record', 'error')
    }
  }

  return (
    <>
      <StewardProfileView
        stewardId={steward.id}
        initialSteward={steward}
        onBack={() => navigate('/dashboard/stewards')}
        onEdit={() => setIsEditModalOpen(true)}
      />

      <EditUserModal
        steward={steward}
        open={isEditModalOpen}
        onSubmit={handleUpdateSteward}
        isSubmitting={updateStewardMutation.isPending}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  )
}

export default StewardDetailPage
