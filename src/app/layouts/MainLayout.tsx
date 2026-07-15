import {
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import AppHeader from '../../components/shared/AppHeader'
import GlobalSearchOverlay from '../../components/global-search/GlobalSearchOverlay'
import useGlobalSearchHotkey from '../../components/global-search/useGlobalSearchHotkey'
import useAuth from '../../hooks/useAuth'
import useMeQuery from '../../features/auth/hooks/useMeQuery'
import useExcuseRequestsQuery from '../../features/attendance/hooks/useExcuseRequestsQuery'

const adminNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Stewards', to: '/dashboard/stewards', icon: Users },
  { label: 'Meetings', to: '/dashboard/meetings', icon: CalendarDays },
  { label: 'Excuses', to: '/dashboard/excuse-requests', icon: MessageSquare },
  { label: 'Attendance', to: '/dashboard/attendance', icon: ClipboardList },
]

const stewardNavItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'My Attendance', to: '/dashboard/attendance', icon: ClipboardList },
  { label: 'My Excuses', to: '/dashboard/my-excuses', icon: FileText },
]

function MainLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const meQuery = useMeQuery(!user && isAuthenticated)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { isOpen: isSearchOpen, open: openSearch, close: closeSearch } = useGlobalSearchHotkey()

  const currentUser = user || meQuery.data

  const isNonSteward = currentUser?.role?.toLowerCase() !== 'steward'
  const { data: pendingExcuses } = useExcuseRequestsQuery(isNonSteward)
  const excuseCount = isNonSteward ? (pendingExcuses?.length ?? 0) : 0

  useEffect(() => {
    if (meQuery.data && !user) {
      localStorage.setItem('user', JSON.stringify(meQuery.data))
    }
  }, [meQuery.data, user])

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileNavOpen])

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const closeMobileNav = () => setIsMobileNavOpen(false)

  const sidebarContent = (collapsed: boolean) => (
    <>
      <div className="border-b border-slate-200 px-6 py-6">
        <div className={`flex items-center justify-between lg:block ${collapsed ? 'lg:text-center' : ''}`}>
          <div>
            <h2 className={`font-semibold tracking-tight text-[#0f2d52] ${collapsed ? 'text-lg lg:text-xl' : 'text-xl'}`}>
              {collapsed ? 'TR' : 'The Registrar'}
            </h2>
            <p className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>
              Attendance Management
            </p>
          </div>

          <button
            type="button"
            onClick={closeMobileNav}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {(() => {
          const role = currentUser?.role?.toLowerCase()
          const isSteward = role === 'steward'
          const items = isSteward ? stewardNavItems : adminNavItems

          if (isSteward) return items

          const isAuthorized = role === 'admin' || role === 'leader' || role === 'pastor'
          return items.filter(({ label }) => {
            if (label === 'Stewards' || label === 'Meetings' || label === 'Excuses') {
              return isAuthorized
            }
            return true
          })
        })().map(({ label, to, icon: Icon, end }) => {
          const showBadge = label === 'Excuses' && excuseCount > 0
          return (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeMobileNav}
            className={({ isActive }) =>
              [
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`,
                isActive
                  ? 'bg-white text-[#0f2d52] shadow-[0_10px_30px_rgba(15,45,82,0.08)]'
                  : 'text-slate-500 hover:bg-white/50 hover:text-[#0f2d52]',
              ].join(' ')
            }
          >
            <div className="relative shrink-0">
              <Icon className="h-5 w-5" />
              {showBadge && collapsed && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold leading-none text-white shadow-sm">
                  {excuseCount > 9 ? '9+' : excuseCount}
                </span>
              )}
            </div>
            <span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
            {showBadge && !collapsed && (
              <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold leading-none text-white">
                {excuseCount}
              </span>
            )}
          </NavLink>
          )
        })}
      </nav>

      <div className="px-4 py-6 space-y-2">
        {/* Profile Info */}
        <div className={`flex items-center gap-3 px-4 py-2 ${collapsed ? 'lg:justify-center' : ''}`}>
          <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-700 shadow-sm border border-orange-200/50 uppercase">
             {currentUser?.name ? currentUser.name.charAt(0) : '👤'}
          </div>
          <div className={`min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
             <p className="text-sm font-bold text-[#0f2d52] truncate">{currentUser?.name || (meQuery.isLoading ? 'Fetching...' : 'Loading...')}</p>
             <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{currentUser?.role || 'User'}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-white/70 hover:text-slate-800 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={collapsed ? 'lg:hidden' : ''}>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f3f6fb] text-slate-900">
      {/* Mobile Header */}
      <header className="flex-none border-b border-slate-200 bg-[#eef3f9] px-4 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#0f2d52]">
              The Registrar
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Attendance Management
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="rounded-xl bg-white p-3 text-[#0f2d52] shadow-sm"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className={`flex flex-1 overflow-hidden lg:grid ${collapsed ? 'lg:grid-cols-[72px_1fr]' : 'lg:grid-cols-[260px_1fr]'}`}>
        <aside className="hidden flex-col border-r border-slate-200 bg-[#eef3f9] lg:flex text-[#0f2d52] transition-all duration-300">
          {sidebarContent(collapsed)}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="mx-auto mb-4 hidden rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-[#0f2d52] lg:block"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </aside>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <AppHeader onSearchClick={openSearch} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" onClick={closeMobileNav} />
        
        <aside 
          className={`relative flex h-full w-[86%] max-w-[320px] flex-col bg-[#eef3f9] shadow-[0_24px_60px_rgba(15,23,42,0.24)] transition-transform duration-300 ease-out ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent(false)}
        </aside>
      </div>

      <GlobalSearchOverlay key={String(isSearchOpen)} isOpen={isSearchOpen} onClose={closeSearch} />
    </div>
  )
}

export default MainLayout
