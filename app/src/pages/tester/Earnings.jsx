import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'
import { formatEuro } from '../../lib/constants'

export default function Earnings() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (!user) return
    supabase.from('payments').select('*').eq('recipient_id', user.id).eq('type', 'tester_reward')
      .order('created_at', { ascending: false }).then(({ data }) => setPayments(data || []))
  }, [user])

  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)
  const paid = payments.filter((p) => ['simulated_paid', 'paid'].includes(p.status)).reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Mes gains</h2>
      <p className="text-sm text-warning mb-6">⚠ Paiements simulés en phase de démonstration.</p>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card p-5"><p className="text-sm text-muted">En attente</p><p className="text-2xl font-bold">{formatEuro(pending)}</p></div>
        <div className="card p-5"><p className="text-sm text-muted">Versés</p><p className="text-2xl font-bold text-success">{formatEuro(paid)}</p></div>
      </div>
      <h3 className="font-semibold mb-4">Historique</h3>
      {payments.length === 0 ? (
        <p className="text-muted text-sm">Aucun gain pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div key={p.id} className="card p-4 flex justify-between">
              <span>{formatEuro(p.amount)}</span>
              <Badge status={p.status} label={p.simulated ? 'Paiement simulé' : p.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
