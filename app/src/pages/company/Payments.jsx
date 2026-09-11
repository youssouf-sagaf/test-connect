import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'
import { formatEuro } from '../../lib/constants'

export default function CompanyPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('payments').select('*').eq('recipient_id', user.id).order('created_at', { ascending: false })
      .then(async ({ data }) => {
        if (!data?.length) { setPayments([]); return }
        const enriched = await Promise.all(data.map(async (p) => {
          if (!p.campaign_id) return p
          const { data: camp } = await supabase.from('campaigns').select('title').eq('id', p.campaign_id).single()
          return { ...p, campaign_title: camp?.title }
        }))
        setPayments(enriched)
      })
  }, [user])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Paiements</h2>
      <p className="text-sm text-warning mb-6">⚠ Paiement simulé — aucun prélèvement réel n&apos;a été effectué.</p>
      {payments.length === 0 ? (
        <div className="card p-8 text-center text-muted">Aucun paiement enregistré.</div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="card p-5 flex justify-between items-center">
              <div>
                <p className="font-medium">{p.campaign_title || 'Campagne'}</p>
                <p className="text-sm text-muted">{new Date(p.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatEuro(p.amount)}</p>
                <Badge status={p.status} label={p.simulated ? 'Paiement simulé' : p.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
