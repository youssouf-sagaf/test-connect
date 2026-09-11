import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import { formatEuro } from '../../lib/constants'
import { createNotification } from '../../services/notifications'

export default function MissionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { testerProfile, profile } = useAuth()
  const [campaign, setCampaign] = useState(null)
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('campaigns').select('*').eq('id', id).single().then(({ data }) => setCampaign(data))
    if (testerProfile) {
      supabase.from('applications').select('*').eq('campaign_id', id).eq('tester_id', testerProfile.id).maybeSingle()
        .then(({ data }) => setApplication(data))
    }
  }, [id, testerProfile])

  const accept = async () => {
    if (!testerProfile || profile?.status === 'suspended') return
    setLoading(true)
    const { data } = await supabase.from('applications').insert({
      campaign_id: id, tester_id: testerProfile.id, status: 'accepted', accepted_at: new Date().toISOString(),
    }).select().single()
    setApplication(data)
    await createNotification(profile.id, 'Mission acceptée', `Vous avez accepté la mission "${campaign.title}".`)
    setLoading(false)
  }

  const reject = () => navigate('/testeur/missions')

  if (!campaign) return <p>Chargement...</p>

  const accepted = application?.status === 'accepted'

  return (
    <div className="max-w-2xl">
      <Link to="/testeur/missions" className="text-sm text-violet">← Missions</Link>
      <h2 className="text-2xl font-bold mt-4">{campaign.title}</h2>
      <p className="text-muted mt-2">{campaign.description}</p>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="card p-4"><p className="text-xs text-muted">Rémunération</p><p className="font-bold text-success">{formatEuro(10)}</p></div>
        <div className="card p-4"><p className="text-xs text-muted">Durée</p><p className="font-bold">{campaign.duration_hours}h</p></div>
      </div>
      <div className="card p-6 mt-6">
        <h3 className="font-semibold mb-2">Objectif</h3>
        <p className="text-sm text-muted">{campaign.objective || '—'}</p>
        <h3 className="font-semibold mt-4 mb-2">Instructions</h3>
        <p className="text-sm text-muted whitespace-pre-wrap">{campaign.instructions || '—'}</p>
        <h3 className="font-semibold mt-4 mb-2">Profil recherché</h3>
        <p className="text-sm text-muted">{JSON.stringify(campaign.criteria || {}, null, 2)}</p>
      </div>
      {!accepted ? (
        <>
          <p className="text-sm text-muted mt-6 p-4 bg-violet-light rounded-xl">
            En acceptant cette mission, vous confirmez pouvoir respecter les consignes et le délai indiqué.
          </p>
          <div className="flex gap-3 mt-4">
            <Button onClick={accept} disabled={loading}>Accepter la mission</Button>
            <Button variant="secondary" onClick={reject}>Refuser</Button>
          </div>
        </>
      ) : (
        <Button to={`/testeur/missions/${id}/feedback`} className="mt-6">Envoyer mon feedback</Button>
      )}
    </div>
  )
}
