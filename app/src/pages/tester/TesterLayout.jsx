import DashboardLayout from '../../components/DashboardLayout'

const navItems = [
  { to: '/testeur', label: 'Tableau de bord', icon: '🏠', end: true },
  { to: '/testeur/missions', label: 'Missions disponibles', icon: '🔍' },
  { to: '/testeur/mes-missions', label: 'Mes missions', icon: '📋' },
  { to: '/testeur/gains', label: 'Mes gains', icon: '💰' },
  { to: '/testeur/profil', label: 'Mon profil', icon: '👤' },
]

const mobileNav = [
  { to: '/testeur', label: 'Accueil', icon: '🏠', end: true },
  { to: '/testeur/missions', label: 'Missions', icon: '🔍' },
  { to: '/testeur/gains', label: 'Gains', icon: '💰' },
  { to: '/testeur/profil', label: 'Profil', icon: '👤' },
]

export default function TesterLayout() {
  return <DashboardLayout navItems={navItems} mobileNav={mobileNav} title="Espace testeur" />
}
