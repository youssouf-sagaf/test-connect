import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import Button from './Button'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/comment-ca-marche', label: 'Comment ça marche' },
  { to: '/entreprises', label: 'Pour les entreprises' },
  { to: '/testeurs', label: 'Pour les testeurs' },
  { to: '/tarifs', label: 'Tarifs' },
  { to: '/faq', label: 'FAQ' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, profile, signOut } = useAuth()

  const dashboardLink = profile?.role === 'company' ? '/entreprise'
    : profile?.role === 'tester' ? '/testeur'
    : profile?.role === 'admin' ? '/admin' : null

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Logo />
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) =>
              `text-sm font-medium ${isActive ? 'text-violet' : 'text-muted hover:text-navy'}`
            }>{l.label}</NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              {dashboardLink && <Button to={dashboardLink} variant="secondary">Mon espace</Button>}
              <Button variant="ghost" onClick={signOut}>Déconnexion</Button>
            </>
          ) : (
            <>
              <Button to="/connexion" variant="ghost">Se connecter</Button>
              <Button to="/inscription">Commencer</Button>
            </>
          )}
        </div>
        <button type="button" className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="block text-sm font-medium text-navy py-2" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border space-y-2">
            {user ? (
              <>
                {dashboardLink && <Button to={dashboardLink} variant="secondary" className="w-full">Mon espace</Button>}
                <Button variant="ghost" className="w-full" onClick={signOut}>Déconnexion</Button>
              </>
            ) : (
              <>
                <Button to="/connexion" variant="secondary" className="w-full">Se connecter</Button>
                <Button to="/inscription" className="w-full">Commencer</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
