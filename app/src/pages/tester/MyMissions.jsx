import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'

export default function MyMissions() {
  const { testerProfile } = useAuth()
  const [apps, setApps] = useState([])

  useEffect(() => {
    if (!testerProfile) return
    supabase.from('applications').select('*, campaigns(*)').eq('tester_id', testerProfile.id)
      .then(({ data }) => setApps(data || []))
  }, [testerProfile])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mes missions</h2>
      {apps.length === 0 ? (
        <div className="card p-8 text-center text-muted">
          <p>Aucune mission acceptée.</p>
          <Link to="/testeur/missions" className="text-violet text-sm mt-2 inline-block">Voir les missions disponibles</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div key={a.id} className="card p-5 flex justify-between items-center">
              <div>
                <p className="font-semibold">{a.campaigns?.title}</p>
                <p className="text-sm text-muted">{a.campaigns?.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={a.status} label={a.status} />
                {a.status === 'accepted' && (
                  <Link to={`/testeur/missions/${a.campaign_id}/feedback`} className="text-sm text-violet font-medium">Feedback →</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
