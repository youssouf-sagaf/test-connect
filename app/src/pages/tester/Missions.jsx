import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatEuro } from '../../lib/constants'

export default function Missions() {
  const [missions, setMissions] = useState([])

  useEffect(() => {
    supabase.from('campaigns').select('*').in('status', ['recruiting', 'in_progress']).order('created_at', { ascending: false })
      .then(({ data }) => setMissions(data || []))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Missions disponibles</h2>
      {missions.length === 0 ? (
        <div className="card p-8 text-center text-muted">Aucune mission disponible.</div>
      ) : (
        <div className="grid gap-4">
          {missions.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted">Projet fictif</p>
                  <h3 className="font-semibold">{m.title}</h3>
                  <p className="text-sm text-muted mt-1">{m.category} · {m.product_type} · {m.duration_hours}h</p>
                  <p className="text-sm text-muted">Échéance : {m.deadline || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">{formatEuro(10)}</p>
                  <Link to={`/testeur/missions/${m.id}`} className="text-sm text-violet font-medium mt-2 inline-block">Voir la mission →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
