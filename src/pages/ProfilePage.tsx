import { useState } from 'react'
import { Loader2, Save, User, Lock } from 'lucide-react'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import useAuth from '../hooks/useAuth'
import useChangePasswordMutation from '../features/auth/hooks/useChangePasswordMutation'
import useUpdateProfileMutation from '../features/stewards/hooks/useUpdateProfileMutation'
import { useToast } from '../hooks/useToast'

function ProfilePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const updateProfile = useUpdateProfileMutation()
  const changePassword = useChangePasswordMutation()

  const [fullName, setFullName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSuccess(false)
    updateProfile.mutate(
      { fullName, phone },
      {
        onSuccess: () => {
          showToast({ title: 'Profile updated', type: 'success' })
          setProfileSuccess(true)
          setTimeout(() => setProfileSuccess(false), 3000)
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
          showToast({ title: err?.response?.data?.message || 'Failed to update profile', type: 'error' })
        },
      }
    )
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      showToast({ title: 'Passwords do not match', type: 'error' })
      return
    }
    if (newPassword.length < 8) {
      showToast({ title: 'Password must be at least 8 characters', type: 'error' })
      return
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          showToast({ title: 'Password changed successfully', type: 'success' })
          setPasswordSuccess(true)
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setTimeout(() => setPasswordSuccess(false), 3000)
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
          showToast({ title: err?.response?.data?.message || 'Failed to change password', type: 'error' })
        },
      }
    )
  }

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="My Profile"
        description="Manage your personal information and password."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Info */}
        <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400"
              />
              <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Role</label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400 capitalize"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Department</label>
              <input
                type="text"
                value={user?.department || ''}
                disabled
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand/90 disabled:opacity-50"
            >
              {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            {profileSuccess && (
              <p className="text-center text-sm font-medium text-emerald-600">Profile updated successfully</p>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
              <p className="mt-1 text-xs text-slate-400">Minimum 8 characters</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-700 disabled:opacity-50"
            >
              {changePassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {changePassword.isPending ? 'Changing...' : 'Change Password'}
            </button>
            {passwordSuccess && (
              <p className="text-center text-sm font-medium text-emerald-600">Password changed successfully</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
