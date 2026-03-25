import { UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddUserModal from '../components/pages/stewards/AddUserModal'
import DeleteUserModal from '../components/pages/stewards/DeleteUserModal'
import DirectoryFooter from '../components/pages/stewards/DirectoryFooter'
import EditUserModal from '../components/pages/stewards/EditUserModal'
import StewardProfileView from '../components/pages/stewards/StewardProfileView'
import StewardsTableSection from '../components/pages/stewards/StewardsTableSection'
import type { Steward } from '../components/pages/stewards/StewardsTableSection'
import StewardsToolbar from '../components/pages/stewards/StewardsToolbar'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'

const stewardStats = {
  total: '1,284',
  growth: '+12%',
}

const stewards = [
  {
    initials: 'JD',
    name: 'Johnathan Doe',
    email: 'john.doe@registry.org',
    department: 'Hospitality',
    role: 'Steward',
    roleTone: 'bg-emerald-100 text-emerald-700',
    phone: '+1 (555) 012-3456',
    dateAdded: 'Oct 12, 2023',
  },
  {
    initials: 'SA',
    name: 'Sarah Al-Farsi',
    email: 'sarah.a@registry.org',
    department: 'Logistics',
    role: 'Leader',
    roleTone: 'bg-blue-100 text-blue-700',
    phone: '+1 (555) 987-6543',
    dateAdded: 'Jan 05, 2024',
  },
  {
    initials: 'MR',
    name: 'Michael Rodriguez',
    email: 'm.rodriguez@registry.org',
    department: 'Pastoral Care',
    role: 'Pastor',
    roleTone: 'bg-rose-100 text-rose-700',
    phone: '+1 (555) 221-4433',
    dateAdded: 'Feb 28, 2024',
  },
  {
    initials: 'EW',
    name: 'Emma Wilson',
    email: 'e.wilson@registry.org',
    department: 'Ushering',
    role: 'Steward',
    roleTone: 'bg-emerald-100 text-emerald-700',
    phone: '+1 (555) 777-8899',
    dateAdded: 'Mar 15, 2024',
  },
]

function StewardsPage() {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [profileSteward, setProfileSteward] = useState<Steward | null>(null)
  const [modalSteward, setModalSteward] = useState<Steward | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (!isAddUserModalOpen && !isEditModalOpen && !isDeleteModalOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAddUserModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        setModalSteward(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAddUserModalOpen, isDeleteModalOpen, isEditModalOpen])

  const handleViewSteward = (steward: Steward) => {
    setProfileSteward(steward)
  }

  const handleEditSteward = (steward: Steward) => {
    setModalSteward(steward)
    setIsEditModalOpen(true)
  }

  const handleDeleteSteward = (steward: Steward) => {
    setModalSteward(steward)
    setIsDeleteModalOpen(true)
  }

  return (
    <>
      <div className="space-y-8">
        {profileSteward ? (
          <StewardProfileView
            steward={profileSteward}
            onBack={() => setProfileSteward(null)}
            onEdit={handleEditSteward}
          />
        ) : (
          <>
            <DashboardPageHeader
              title="Registry Directory"
              description="Manage personnel records, roles, and departmental assignments."
              actions={
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f2d52] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(15,45,82,0.18)] transition hover:bg-[#173c67]"
                >
                  <UserPlus className="h-4 w-4" />
                  Add New User
                </button>
              }
            />

            <StewardsToolbar
              total={stewardStats.total}
              growth={stewardStats.growth}
            />
            <StewardsTableSection
              stewards={stewards}
              onView={handleViewSteward}
              onEdit={handleEditSteward}
              onDelete={handleDeleteSteward}
            />
            <DirectoryFooter />
          </>
        )}
      </div>

      <AddUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
      <EditUserModal
        steward={modalSteward}
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setModalSteward(null)
        }}
      />
      <DeleteUserModal
        steward={modalSteward}
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setModalSteward(null)
        }}
      />
    </>
  )
}

export default StewardsPage
