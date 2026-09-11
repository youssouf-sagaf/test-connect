import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Button from '../../components/Button'

export default function CompanySettings() {
  const { profile, company, refreshProfile } = useAuth()

  const exportData = async () => {
    const data = { profile, company }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'testconnect-export.json'
    a.click()
  }

  const deleteAccount = async () => {
    if (!confirm('Supprimer définitivement votre compte ?')) return
    await supabase.auth.signOut()
    alert('Demande de suppression enregistrée. Contactez le support pour finaliser.')
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
      <div className="card p-6 space-y-4">
        <div><p className="text-sm text-muted">Entreprise</p><p className="font-medium">{company?.name}</p></div>
        <div><p className="text-sm text-muted">Email</p><p className="font-medium">{profile?.email}</p></div>
        <div><p className="text-sm text-muted">Téléphone</p><p className="font-medium">{profile?.phone || '—'}</p></div>
      </div>
      <div className="mt-6 space-y-3">
        <Button variant="secondary" onClick={exportData}>Exporter mes données (RGPD)</Button>
        <Button variant="danger" onClick={deleteAccount}>Supprimer mon compte</Button>
      </div>
    </div>
  )
}
