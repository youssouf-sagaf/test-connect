import { useAuth } from '../../context/AuthContext'

export default function TesterProfile() {
  const { profile, testerProfile } = useAuth()

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-6">Mon profil</h2>
      <div className="card p-6 space-y-4">
        <div><p className="text-sm text-muted">Nom</p><p className="font-medium">{profile?.first_name} {profile?.last_name}</p></div>
        <div><p className="text-sm text-muted">Email</p><p className="font-medium">{profile?.email}</p></div>
        <div><p className="text-sm text-muted">Ville</p><p className="font-medium">{testerProfile?.city || '—'}</p></div>
        <div><p className="text-sm text-muted">Appareils</p><p className="font-medium">{testerProfile?.devices?.join(', ') || '—'}</p></div>
        <div><p className="text-sm text-muted">Compétences</p><p className="font-medium">{testerProfile?.skills?.join(', ') || '—'}</p></div>
        <div><p className="text-sm text-muted">Vérification</p><p className="font-medium">{testerProfile?.verified ? '✓ Vérifié' : 'En attente'}</p></div>
        <div><p className="text-sm text-muted">Note moyenne</p><p className="font-medium">{testerProfile?.average_rating || '—'}</p></div>
      </div>
    </div>
  )
}
