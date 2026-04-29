import { useNavigate, useParams } from 'react-router-dom'
import StewardProfileView from '../components/pages/stewards/StewardProfileView'
import { useStewardDetailQuery } from '../features/stewards/hooks/useStewardsQuery'
import { useState } from 'react'
import EditUserModal from '../components/pages/stewards/EditUserModal'
import useUpdateStewardMutation from '../features/stewards/hooks/useUpdateStewardMutation'
import { useToast } from '../hooks/useToast'
import type { UpdateStewardValues } from '../features/stewards/types'

function StewardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const detailQuery = useStewardDetailQuery(id ?? null)
  const updateStewardMutation = useUpdateStewardMutation()

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
