import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatEuro } from '../../lib/constants'

export default function TesterDashboard() {
  const { testerProfile } = useAuth()
  const [missions, setMissions] = useState([])
  const [applications, setApplications] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    if (!testerProfile) return
    supabase.from('campaigns').select('*').in('status', ['recruiting', 'in_progress']).limit(5)
      .then(({ data }) => setMissions(data || []))
    supabase.from('applications').select('*, campaigns(*)').eq('tester_id', testerProfile.id)
      .then(({ data }) => setApplications(data || []))
    supabase.from('payments').select('*').eq('recipient_id', testerProfile.user_id)
      .then(({ data }) => setPayments(data || []))
  }, [testerProfile])

  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)
  const paid = payments.filter((p) => p.status === 'simulated_paid' || p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-4"><p className="text-xs text-muted">Missions acceptées</p><p className="text-xl font-bold">{applications.filter((a) => a.status === 'accepted').length}</p></div>
        <div className="card p-4"><p className="text-xs text-muted">Terminées</p><p className="text-xl font-bold">{applications.filter((a) => a.status === 'completed').length}</p></div>
        <div className="card p-4"><p className="text-xs text-muted">Gains en attente</p><p className="text-xl font-bold">{formatEuro(pending)}</p></div>
        <div className="card p-4"><p className="text-xs text-muted">Gains versés</p><p className="text-xl font-bold">{formatEuro(paid)}</p></div>
      </div>
      <h3 className="font-semibold mb-4">Missions recommandées</h3>
      <div className="space-y-3">
        {missions.map((m) => (
          <Link key={m.id} to={`/testeur/missions/${m.id}`} className="card p-4 block">
            <p className="font-medium">{m.title}</p>
            <p className="text-sm text-muted">{m.category} · {m.duration_hours}h · {formatEuro(10)}</p>
          </Link>
        ))}
        {missions.length === 0 && <p className="text-muted text-sm">Aucune mission disponible pour le moment.</p>}
      </div>
    </div>
  )
}
