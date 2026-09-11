import DashboardLayout from '../../components/DashboardLayout'

const navItems = [
  { to: '/entreprise', label: 'Tableau de bord', icon: '📊', end: true },
  { to: '/entreprise/campagnes', label: 'Mes campagnes', icon: '📋' },
  { to: '/entreprise/nouvelle-campagne', label: 'Nouvelle campagne', icon: '➕' },
  { to: '/entreprise/rapports', label: 'Rapports', icon: '📈' },
  { to: '/entreprise/paiements', label: 'Paiements', icon: '💳' },
  { to: '/entreprise/parametres', label: 'Paramètres', icon: '⚙️' },
]

export default function CompanyLayout() {
  return <DashboardLayout navItems={navItems} title="Espace entreprise" />
}
