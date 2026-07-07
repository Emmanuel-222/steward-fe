import { UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddUserModal from '../components/pages/stewards/AddUserModal'
import DeleteUserModal from '../components/pages/stewards/DeleteUserModal'
import DirectoryFooter from '../components/pages/stewards/DirectoryFooter'
import EditUserModal from '../components/pages/stewards/EditUserModal'
import StewardsTableSection from '../components/pages/stewards/StewardsTableSection'
import StewardsToolbar from '../components/pages/stewards/StewardsToolbar'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import useCreateStewardMutation from '../features/stewards/hooks/useCreateStewardMutation'
import useDeleteStewardMutation from '../features/stewards/hooks/useDeleteStewardMutation'
import useStewardsQuery from '../features/stewards/hooks/useStewardsQuery'
import useUpdateStewardMutation from '../features/stewards/hooks/useUpdateStewardMutation'
import useAuth from '../hooks/useAuth'
import useMeQuery from '../features/auth/hooks/useMeQuery'
import { useToast } from '../hooks/useToast'
import type {
  CreateStewardValues,
  Steward,
  UpdateStewardValues,
} from '../features/stewards/types'

function StewardsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const meQuery = useMeQuery(!user && isAuthenticated)
  const currentUser = user || meQuery.data
  
  const role = currentUser?.role?.toLowerCase()
  const isAuthorized = role === 'admin' || role === 'leader' || role === 'pastor'
  const isAdmin = role === 'admin'
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [modalStewardId, setModalStewardId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const stewardsQuery = useStewardsQuery(debouncedSearchTerm)
  const createStewardMutation = useCreateStewardMutation()
  const updateStewardMutation = useUpdateStewardMutation()
  const deleteStewardMutation = useDeleteStewardMutation()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    if (!isAddUserModalOpen && !isEditModalOpen && !isDeleteModalOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAddUserModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        setModalStewardId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAddUserModalOpen, isDeleteModalOpen, isEditModalOpen])

  if (isAuthenticated && !currentUser) {
    return (
      <div className="rounded-[30px] border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        Loading directory...
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-[35px] border border-slate-200 bg-white px-6 py-24 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <h3 className="text-2xl font-bold tracking-tight text-[#0f2d52]">Access Restricted</h3>
        <p className="text-slate-500 font-medium max-w-md">
          You don't have the necessary permissions to view the steward registry. Please contact your administrator if you believe this is an error.
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

  const stewards = stewardsQuery.data ?? []
  const roles = Array.from(new Set(stewards.map((steward) => steward.role)))
  const filteredStewards =
    selectedRole === 'All Roles'
      ? stewards
      : stewards.filter((steward) => steward.role === selectedRole)
  
  const modalSteward =
    stewards.find((steward) => steward.id === modalStewardId) ?? null

  const handleViewSteward = (steward: Steward) => {
    navigate(`/dashboard/stewards/${steward.id}`)
  }

  const handleEditSteward = (steward: Steward) => {
    setModalStewardId(steward.id)
    setIsEditModalOpen(true)
  }

  const handleDeleteSteward = (steward: Steward) => {
    setModalStewardId(steward.id)
    setIsDeleteModalOpen(true)
  }

  const handleCreateSteward = async (values: CreateStewardValues) => {
    try {
      await createStewardMutation.mutateAsync(values)
      showToast('Steward added successfully', 'success')
      setIsAddUserModalOpen(false)
    } catch {
      showToast('Failed to add steward', 'error')
    }
  }

  const handleUpdateSteward = async (values: UpdateStewardValues) => {
    if (!modalSteward) return

    try {
      await updateStewardMutation.mutateAsync({
        id: modalSteward.id,
        payload: values,
      })
      showToast('Steward updated successfully', 'success')
      setIsEditModalOpen(false)
      setModalStewardId(null)
    } catch {
      showToast('Failed to update steward', 'error')
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!modalSteward) return

    try {
      await deleteStewardMutation.mutateAsync(modalSteward.id)
      showToast('Steward removed from registry', 'success')
      setIsDeleteModalOpen(false)
      setModalStewardId(null)
    } catch {
      showToast('Failed to delete steward', 'error')
    }
  }

  return (
    <>
      <div className="space-y-8">
        <DashboardPageHeader
          title="Registry Directory"
          description="Manage personnel records, roles, and departmental assignments."
          actions={
            isAdmin && (
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f2d52] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-[#173c67]"
              >
                <UserPlus className="h-4 w-4" />
                Add New User
              </button>
            )
          }
        />

        <StewardsToolbar
          total={filteredStewards.length}
          growth={searchTerm.trim() ? 'filtered' : 'live'}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          roleValue={selectedRole}
          onRoleChange={setSelectedRole}
          roles={roles}
        />
        <StewardsTableSection
          stewards={filteredStewards}
          onView={handleViewSteward}
          onEdit={handleEditSteward}
          onDelete={handleDeleteSteward}
          isLoading={stewardsQuery.isLoading}
          errorMessage={
            stewardsQuery.isError
              ? 'Unable to load stewards right now.'
              : undefined
          }
        />
        <DirectoryFooter />
      </div>

      <AddUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleCreateSteward}
        isSubmitting={createStewardMutation.isPending}
      />
      <EditUserModal
        steward={modalSteward}
        open={isEditModalOpen}
        onSubmit={handleUpdateSteward}
        isSubmitting={updateStewardMutation.isPending}
        onClose={() => {
          setIsEditModalOpen(false)
          setModalStewardId(null)
        }}
      />
      <DeleteUserModal
        steward={modalSteward}
        open={isDeleteModalOpen}
        onConfirm={handleDeleteConfirmed}
        isSubmitting={deleteStewardMutation.isPending}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setModalStewardId(null)
        }}
      />
    </>
  )
}

export default StewardsPage
