import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { CAMPAIGN_STATUS_LABELS, formatEuro } from '../../lib/constants'

export default function CompanyDashboard() {
  const { company } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState({ active: 0, completed: 0, feedbacks: 0, budget: 0 })

  useEffect(() => {
    if (!company) return
    supabase.from('campaigns').select('*').eq('company_id', company.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        setCampaigns(data || [])
        setStats({
          active: (data || []).filter((c) => ['recruiting', 'in_progress', 'feedbacks_pending'].includes(c.status)).length,
          completed: (data || []).filter((c) => c.status === 'completed').length,
          feedbacks: 0,
          budget: (data || []).filter((c) => c.paid).reduce((s, c) => s + Number(c.total_price), 0),
        })
      })
  }, [company])

  if (!company) return <p className="text-muted">Chargement du profil entreprise...</p>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Bonjour, {company.name}</h2>
          <p className="text-muted">Gérez vos campagnes de test</p>
        </div>
        <Button to="/entreprise/nouvelle-campagne">Créer une campagne</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Campagnes actives', value: stats.active },
          { label: 'Terminées', value: stats.completed },
          { label: 'Feedbacks reçus', value: stats.feedbacks },
          { label: 'Budget utilisé', value: formatEuro(stats.budget) },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      <h3 className="font-semibold mb-4">Dernières campagnes</h3>
      {campaigns.length === 0 ? (
        <div className="card p-8 text-center text-muted">
          <p>Aucune campagne pour le moment.</p>
          <Button to="/entreprise/nouvelle-campagne" className="mt-4">Créer votre première campagne</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.slice(0, 5).map((c) => (
            <Link key={c.id} to={`/entreprise/campagnes/${c.id}`} className="card p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-muted">{formatEuro(c.total_price)} · {c.testers_count} testeurs</p>
              </div>
              <Badge status={c.status} label={CAMPAIGN_STATUS_LABELS[c.status]} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
