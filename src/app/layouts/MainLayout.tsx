import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import AppHeader from '../../components/shared/AppHeader'
import useAuth from '../../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Stewards', to: '/dashboard/stewards', icon: Users },
  { label: 'Meetings', to: '/dashboard/meetings', icon: CalendarDays },
  { label: 'Attendance', to: '/dashboard/attendance', icon: ClipboardList },
]

function MainLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const closeMobileNav = () => setIsMobileNavOpen(false)

  const sidebarContent = (
    <>
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="flex items-center justify-between lg:block">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#0f2d52]">
              The Registrar
            </h2>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
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
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeMobileNav}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-[#0f2d52] text-white shadow-[0_12px_24px_rgba(15,45,82,0.2)]'
                  : 'text-slate-500 hover:bg-white/80 hover:text-[#0f2d52]',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-6">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-white/70 hover:text-slate-800"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      <div className="border-b border-slate-200 bg-[#eef3f9] px-4 py-4 lg:hidden">
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
      </div>

      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden min-h-screen flex-col border-r border-slate-200 bg-[#eef3f9] lg:flex text-[#0f2d52]">
          {sidebarContent}
        </aside>

        <div className="flex min-h-screen flex-col">
          <AppHeader />
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
          {sidebarContent}
        </aside>
      </div>
    </div>
  )
}

export default MainLayout
