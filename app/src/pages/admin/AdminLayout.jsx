import DashboardLayout from '../../components/DashboardLayout'

const navItems = [
  { to: '/admin', label: 'Vue d\'ensemble', icon: '📊', end: true },
  { to: '/admin/entreprises', label: 'Entreprises', icon: '🏢' },
  { to: '/admin/testeurs', label: 'Testeurs', icon: '👥' },
  { to: '/admin/campagnes', label: 'Campagnes', icon: '📋' },
  { to: '/admin/feedbacks', label: 'Feedbacks', icon: '💬' },
  { to: '/admin/paiements', label: 'Paiements', icon: '💳' },
  { to: '/admin/litiges', label: 'Litiges', icon: '⚠️' },
]

export default function AdminLayout() {
  return <DashboardLayout navItems={navItems} title="Administration" />
}
