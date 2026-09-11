import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

export default function Reports() {
  const { id } = useParams()
  const { company } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [report, setReport] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    if (!company) return
    supabase.from('campaigns').select('*').eq('company_id', company.id).eq('status', 'completed')
      .then(({ data }) => setCampaigns(data || []))
  }, [company])

  useEffect(() => {
    if (!id) return
    supabase.from('campaigns').select('*').eq('id', id).single().then(({ data }) => setReport(data))
    supabase.from('feedbacks').select('*').eq('campaign_id', id).eq('status', 'approved')
      .then(({ data }) => setFeedbacks(data || []))
  }, [id])

  if (id && report) {
    const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : 0
    const positives = feedbacks.map((f) => f.positives).filter(Boolean)
    const negatives = feedbacks.map((f) => f.negatives).filter(Boolean)

    return (
      <div>
        <Link to="/entreprise/rapports" className="text-sm text-violet">← Rapports</Link>
        <h2 className="text-2xl font-bold mt-4">Rapport — {report.title}</h2>
        <p className="text-muted text-sm">Données de démonstration · Projet fictif</p>
        <div className="grid sm:grid-cols-4 gap-4 mt-6">
          <div className="card p-4"><p className="text-xs text-muted">Testeurs</p><p className="text-xl font-bold">{feedbacks.length}/{report.testers_count}</p></div>
          <div className="card p-4"><p className="text-xs text-muted">Complétion</p><p className="text-xl font-bold">{Math.round((feedbacks.length / report.testers_count) * 100)}%</p></div>
          <div className="card p-4"><p className="text-xs text-muted">Note moyenne</p><p className="text-xl font-bold">{avg}/5</p></div>
          <div className="card p-4"><p className="text-xs text-muted">Produit</p><p className="text-sm font-medium">{report.category}</p></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="card p-6">
            <h3 className="font-semibold text-success mb-3">Points positifs</h3>
            <ul className="text-sm space-y-2">{positives.length ? positives.map((p, i) => <li key={i}>• {p}</li>) : <li>Aucun pour le moment</li>}</ul>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold text-warning mb-3">Points à améliorer</h3>
            <ul className="text-sm space-y-2">{negatives.length ? negatives.map((n, i) => <li key={i}>• {n}</li>) : <li>Aucun pour le moment</li>}</ul>
          </div>
        </div>
        <div className="card p-6 mt-6">
          <h3 className="font-semibold mb-3">Commentaires anonymisés</h3>
          {feedbacks.map((f, i) => (
            <blockquote key={f.id} className="border-l-4 border-violet pl-4 mb-4 text-sm text-muted">
              Exemple de feedback #{i + 1} — {f.comment}
            </blockquote>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => window.print()}>Télécharger PDF</Button>
          <Button to="/entreprise/nouvelle-campagne">Relancer une campagne similaire</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Rapports</h2>
      {campaigns.length === 0 ? (
        <p className="text-muted">Aucun rapport disponible. Les rapports apparaissent quand une campagne est terminée.</p>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Link key={c.id} to={`/entreprise/rapports/${c.id}`} className="card p-5 block hover:shadow-md">
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-muted">{c.category}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
