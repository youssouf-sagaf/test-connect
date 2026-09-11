import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatEuro } from '../../lib/constants'

export default function AdminDashboard() {
  const [stats, setStats] = useState({})

  useEffect(() => {
    Promise.all([
      supabase.from('companies').select('id', { count: 'exact', head: true }),
      supabase.from('tester_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('campaigns').select('*'),
      supabase.from('feedbacks').select('*').eq('status', 'submitted'),
      supabase.from('payments').select('*').eq('status', 'pending'),
      supabase.from('disputes').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    ]).then(([companies, testers, campaigns, feedbacks, payments, disputes]) => {
      const camps = campaigns.data || []
      setStats({
        companies: companies.count || 0,
        testers: testers.count || 0,
        activeCampaigns: camps.filter((c) => ['recruiting', 'in_progress'].includes(c.status)).length,
        completedCampaigns: camps.filter((c) => c.status === 'completed').length,
        pendingFeedbacks: feedbacks.data?.length || 0,
        pendingPayments: payments.data?.length || 0,
        revenue: camps.filter((c) => c.paid).reduce((s, c) => s + Number(c.total_price), 0),
        disputes: disputes.count || 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Entreprises', value: stats.companies },
    { label: 'Testeurs', value: stats.testers },
    { label: 'Campagnes actives', value: stats.activeCampaigns },
    { label: 'Campagnes terminées', value: stats.completedCampaigns },
    { label: 'Feedbacks à valider', value: stats.pendingFeedbacks },
    { label: 'Paiements en attente', value: stats.pendingPayments },
    { label: 'CA estimé', value: formatEuro(stats.revenue || 0) },
    { label: 'Litiges ouverts', value: stats.disputes },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vue d&apos;ensemble</h2>
      <p className="text-sm text-muted mb-6">Données de démonstration</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value ?? '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
