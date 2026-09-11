import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { CAMPAIGN_STATUS_LABELS, formatEuro } from '../../lib/constants'

export default function Campaigns() {
  const { company } = useAuth()
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    if (!company) return
    supabase.from('campaigns').select('*').eq('company_id', company.id).order('created_at', { ascending: false })
      .then(({ data }) => setCampaigns(data || []))
  }, [company])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mes campagnes</h2>
        <Button to="/entreprise/nouvelle-campagne">Nouvelle campagne</Button>
      </div>
      {campaigns.length === 0 ? (
        <div className="card p-8 text-center text-muted">Aucune campagne.</div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Link key={c.id} to={`/entreprise/campagnes/${c.id}`} className="card p-5 block hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-muted mt-1">{c.category} · {formatEuro(c.total_price)} · {c.testers_count} testeurs</p>
                </div>
                <Badge status={c.status} label={CAMPAIGN_STATUS_LABELS[c.status]} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
