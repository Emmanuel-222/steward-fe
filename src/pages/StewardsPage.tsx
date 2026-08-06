import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AddUserDropdown from '../components/pages/stewards/AddUserDropdown'
import AddUserModal from '../components/pages/stewards/AddUserModal'
import ImportStewardsModal from '../components/pages/stewards/ImportStewardsModal'
import DeleteUserModal from '../components/pages/stewards/DeleteUserModal'
import DirectoryFooter from '../components/pages/stewards/DirectoryFooter'
import EditUserModal from '../components/pages/stewards/EditUserModal'
import Pagination from '../components/ui/Pagination'
import StewardsTableSection from '../components/pages/stewards/StewardsTableSection'
import StewardsToolbar from '../components/pages/stewards/StewardsToolbar'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import useCreateStewardMutation from '../features/stewards/hooks/useCreateStewardMutation'
import useDeleteStewardMutation from '../features/stewards/hooks/useDeleteStewardMutation'
import useImportStewardsMutation from '../features/stewards/hooks/useImportStewardsMutation'
import useStewardsQuery from '../features/stewards/hooks/useStewardsQuery'
import useUpdateStewardMutation from '../features/stewards/hooks/useUpdateStewardMutation'
import useAuth from '../hooks/useAuth'
import useMeQuery from '../features/auth/hooks/useMeQuery'
import { useToast } from '../hooks/useToast'
import type { PaginationData } from '../types'
import type {
  CreateStewardValues,
  Steward,
  UpdateStewardValues,
} from '../features/stewards/types'

const DEFAULT_PAGE_SIZE = 10

function StewardsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const meQuery = useMeQuery(!user && isAuthenticated)
  const currentUser = user || meQuery.data
  
  const role = currentUser?.role?.toLowerCase()
  const isAuthorized = role === 'admin' || role === 'leader' || role === 'pastor'
  const isAdmin = role === 'admin'
  const [searchParams, setSearchParams] = useSearchParams()
  const initialFromUrl = searchParams.get('department') ?? searchParams.get('search') ?? ''
  const [searchTerm, setSearchTerm] = useState(initialFromUrl)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialFromUrl)
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [modalStewardId, setModalStewardId] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const stewardsQuery = useStewardsQuery(debouncedSearchTerm, page, pageSize, selectedRole)
  const createStewardMutation = useCreateStewardMutation()
  const updateStewardMutation = useUpdateStewardMutation()
  const deleteStewardMutation = useDeleteStewardMutation()
  const importMutation = useImportStewardsMutation()

  const resetPage = useCallback(() => setPage(1), [])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
      const dept = searchParams.get('department')
      const srch = searchParams.get('search')
      if ((dept && value !== dept) || (srch && value !== srch)) {
        setSearchParams({}, { replace: true })
      }
    },
    [searchParams, setSearchParams],
  )

  const prevParamsRef = useRef(searchParams.toString())

  useEffect(() => {
    const paramsStr = searchParams.toString()
    if (paramsStr === prevParamsRef.current) return
    prevParamsRef.current = paramsStr

    const dept = searchParams.get('department')
    const srch = searchParams.get('search')
    const urlQuery = dept || srch || ''
    if (urlQuery) {
      requestAnimationFrame(() => {
        setSearchTerm(urlQuery)
        setDebouncedSearchTerm(urlQuery)
        resetPage()
      })
    }
  }, [searchParams, resetPage])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      resetPage()
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchTerm, resetPage])

  useEffect(() => {
    if (!isAddUserModalOpen && !isEditModalOpen && !isDeleteModalOpen && !isImportModalOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAddUserModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        setIsImportModalOpen(false)
        setModalStewardId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAddUserModalOpen, isDeleteModalOpen, isEditModalOpen, isImportModalOpen])

  if (isAuthenticated && !currentUser) {
    return (
      <div className="rounded-card border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
        Loading directory...
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-card border border-slate-200 bg-white px-6 py-24 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
        <h3 className="text-2xl font-bold tracking-tight text-brand">Access Restricted</h3>
        <p className="text-slate-500 font-medium max-w-md">
          You don't have the necessary permissions to view the steward registry. Please contact your administrator if you believe this is an error.
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

  const stewardsQueryData = stewardsQuery.data
  const stewards = Array.isArray(stewardsQueryData)
    ? stewardsQueryData
    : (stewardsQueryData as { items?: Steward[] } | null)?.items ?? []
  const pagination = !Array.isArray(stewardsQueryData)
    ? (stewardsQueryData as { pagination?: PaginationData } | null)?.pagination ?? null
    : null

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
      stewardsQuery.refetch()
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
      stewardsQuery.refetch()
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
      stewardsQuery.refetch()
    } catch {
      showToast('Failed to delete steward', 'error')
    }
  }

  const handleImportStewards = async (file: File) => {
    const result = await importMutation.mutateAsync(file)
    stewardsQuery.refetch()
    return result
  }

  return (
    <>
      <div className="space-y-8">
        <DashboardPageHeader
          title="Registry Directory"
          description="Manage personnel records, roles, and departmental assignments."
          actions={
            isAdmin && (
              <AddUserDropdown
                onAddSingle={() => setIsAddUserModalOpen(true)}
                onImportCsv={() => setIsImportModalOpen(true)}
              />
            )
          }
        />

        <div className="animate-stagger-fade" style={{ animationDelay: '0ms' }}>
          <StewardsToolbar
            total={pagination?.total ?? filteredStewards.length}
            growth={searchTerm.trim() ? 'filtered' : 'live'}
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            roleValue={selectedRole}
            onRoleChange={(r) => { setSelectedRole(r); resetPage() }}
            roles={roles}
          />
        </div>
        <div className="animate-stagger-fade" style={{ animationDelay: '100ms' }}>
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
          onRetry={() => stewardsQuery.refetch()}
        />
        </div>
        <div className="animate-stagger-fade" style={{ animationDelay: '200ms' }}>
        {pagination && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
          />
        )}
        <DirectoryFooter />
        </div>
      </div>

      <AddUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleCreateSteward}
        isSubmitting={createStewardMutation.isPending}
      />
      <ImportStewardsModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSubmit={handleImportStewards}
        isSubmitting={importMutation.isPending}
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


