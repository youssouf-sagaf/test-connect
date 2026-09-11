import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { CAMPAIGN_STATUS_LABELS, formatEuro } from '../../lib/constants'

export default function CampaignDetail() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    supabase.from('campaigns').select('*').eq('id', id).single().then(({ data }) => setCampaign(data))
    supabase.from('feedbacks').select('*').eq('campaign_id', id).then(({ data }) => setFeedbacks(data || []))
  }, [id])

  if (!campaign) return <p>Chargement...</p>

  const avgRating = feedbacks.filter((f) => f.rating).length
    ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.filter((f) => f.rating).length).toFixed(1)
    : '—'

  return (
    <div>
      <Link to="/entreprise/campagnes" className="text-sm text-violet mb-4 inline-block">← Retour</Link>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{campaign.title}</h2>
          <p className="text-muted">{campaign.description}</p>
        </div>
        <Badge status={campaign.status} label={CAMPAIGN_STATUS_LABELS[campaign.status]} />
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-4"><p className="text-sm text-muted">Prix</p><p className="font-bold">{formatEuro(campaign.total_price)}</p></div>
        <div className="card p-4"><p className="text-sm text-muted">Testeurs</p><p className="font-bold">{campaign.testers_count}</p></div>
        <div className="card p-4"><p className="text-sm text-muted">Note moyenne</p><p className="font-bold">{avgRating}</p></div>
      </div>
      {campaign.status === 'completed' && (
        <Button to={`/entreprise/rapports/${id}`}>Voir le rapport</Button>
      )}
      <h3 className="font-semibold mt-8 mb-4">Feedbacks ({feedbacks.length})</h3>
      {feedbacks.length === 0 ? (
        <p className="text-muted text-sm">Aucun feedback pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((f) => (
            <div key={f.id} className="card p-4">
              <div className="flex justify-between">
                <span className="font-medium">★ {f.rating}/5</span>
                <Badge status={f.status} label={f.status} />
              </div>
              <p className="text-sm text-muted mt-2">{f.comment || 'Sans commentaire'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
