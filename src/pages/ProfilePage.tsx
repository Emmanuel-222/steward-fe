import { useState } from 'react'
import { Eye, EyeOff, Loader2, Save, User, Lock, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardPageHeader from '../components/shared/DashboardPageHeader'
import useAuth from '../hooks/useAuth'
import useChangePasswordMutation from '../features/auth/hooks/useChangePasswordMutation'
import useUpdateProfileMutation from '../features/stewards/hooks/useUpdateProfileMutation'
import { useToast } from '../hooks/useToast'

function PasswordRequirements({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
  ]

  if (!password) return null

  return (
    <div className="mt-2 space-y-1">
      {checks.map(({ label, met }) => (
        <div key={label} className="flex items-center gap-1.5">
          <CheckCircle className={`h-3 w-3 ${met ? 'text-emerald-500' : 'text-slate-300'}`} />
          <span className={`text-xs ${met ? 'text-emerald-600' : 'text-slate-500'}`}>{label}</span>
        </div>
      ))}
    </div>
  )
}

function ProfilePage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const updateProfile = useUpdateProfileMutation()
  const changePassword = useChangePasswordMutation()

  const [fullName, setFullName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(
      { fullName, phone },
      {
        onSuccess: () => {
          showToast('Profile updated', 'success')
          setTimeout(() => navigate('/dashboard'), 800)
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
          showToast(err?.response?.data?.message || 'Failed to update profile', 'error')
        },
      }
    )
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          showToast('Password changed successfully', 'success')
          setTimeout(() => navigate('/dashboard'), 800)
        },
        onError: (err: Error & { response?: { data?: { message?: string } } }) => {
          showToast(err?.response?.data?.message || 'Failed to change password', 'error')
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
              <label htmlFor="profile-full-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <input
                id="profile-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
              <input
                id="profile-email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />
              <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
            </div>
            <div>
              <label htmlFor="profile-phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Phone</label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
              />
            </div>
            <div>
              <label htmlFor="profile-role" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Role</label>
              <input
                id="profile-role"
                type="text"
                value={user?.role || ''}
                disabled
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500 capitalize"
              />
            </div>
            <div>
              <label htmlFor="profile-department" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Department</label>
              <input
                id="profile-department"
                type="text"
                value={user?.department || ''}
                disabled
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500"
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
              <label htmlFor="profile-current-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
              <div className="relative">
                <input
                  id="profile-current-password"
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(s => !s)}
                  aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="profile-new-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
              <div className="relative">
                <input
                  id="profile-new-password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(s => !s)}
                  aria-label={showNew ? 'Hide new password' : 'Show new password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordRequirements password={newPassword} />
            </div>
            <div>
              <label htmlFor="profile-confirm-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
              <div className="relative">
                <input
                  id="profile-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(s => !s)}
                  aria-label={showConfirm ? 'Hide confirmation password' : 'Show confirmation password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-rose-500">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-slate-700 disabled:opacity-50"
            >
              {changePassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {changePassword.isPending ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
