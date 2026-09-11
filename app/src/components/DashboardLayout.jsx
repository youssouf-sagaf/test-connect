import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ navItems, mobileNav, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const NavContent = () => (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isActive ? 'bg-violet-light text-violet' : 'text-muted hover:bg-gray-50 hover:text-navy'
            }`
          }
        >
          <span>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-border">
          <Logo className="h-8" />
        </div>
        <div className="p-4"><NavContent /></div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" className="lg:hidden p-2" onClick={() => setSidebarOpen(true)} aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="font-semibold text-navy">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">
              {profile?.first_name} {profile?.last_name}
            </span>
            <button type="button" onClick={handleSignOut} className="text-sm text-muted hover:text-navy">
              Déconnexion
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
        {mobileNav && (
          <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border flex justify-around py-2 z-20">
            {mobileNav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) =>
                `flex flex-col items-center text-xs px-2 py-1 ${isActive ? 'text-violet' : 'text-muted'}`
              }>
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}
