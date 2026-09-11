import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import { createNotification } from '../../services/notifications'

export default function Feedback() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { testerProfile, profile } = useAuth()
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    rating: 5, comment: '', positives: '', negatives: '', suggestions: '',
    q1: '', q2: '', honest: false,
  })

  useEffect(() => {
    if (!testerProfile) return
    supabase.from('feedbacks').select('*').eq('campaign_id', id).eq('tester_id', testerProfile.id).maybeSingle()
      .then(({ data }) => {
        if (data?.status === 'submitted' || data?.status === 'approved') setSent(true)
        setExisting(data)
      })
  }, [id, testerProfile])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const inputCls = 'w-full px-4 py-3 border border-border rounded-xl'

  const submit = async (asDraft = false) => {
    if (!asDraft && !form.honest) { alert('Veuillez confirmer l\'honnêteté de votre feedback.'); return }
    setLoading(true)
    const payload = {
      campaign_id: id,
      tester_id: testerProfile.id,
      rating: form.rating,
      comment: form.comment,
      positives: form.positives,
      negatives: form.negatives,
      suggestions: form.suggestions,
      answers: { q1: form.q1, q2: form.q2 },
      status: asDraft ? 'draft' : 'submitted',
      submitted_at: asDraft ? null : new Date().toISOString(),
    }

    if (existing) {
      await supabase.from('feedbacks').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('feedbacks').insert(payload)
    }

    if (!asDraft) {
      await supabase.from('applications').update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('campaign_id', id).eq('tester_id', testerProfile.id)
      await createNotification(profile.id, 'Feedback envoyé', 'Votre feedback est en attente de validation.')
      setSent(true)
    }
    setLoading(false)
    if (!asDraft) navigate('/testeur/mes-missions')
  }

  if (sent) {
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <p className="text-4xl mb-4">✓</p>
        <h2 className="text-xl font-bold">Feedback envoyé</h2>
        <p className="text-muted mt-2">Votre feedback a bien été envoyé. Le paiement sera déclenché après validation.</p>
        <Button to="/testeur/mes-missions" className="mt-6">Mes missions</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Link to={`/testeur/missions/${id}`} className="text-sm text-violet">← Mission</Link>
      <h2 className="text-2xl font-bold mt-4">Soumettre mon feedback</h2>
      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium mb-2">Note (1-5)</label>
          <select value={form.rating} onChange={(e) => set('rating', Number(e.target.value))} className={inputCls}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Facilité d'utilisation ?</label>
          <select value={form.q1} onChange={(e) => set('q1', e.target.value)} className={inputCls}>
            <option value="">Choisir...</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
        <textarea placeholder="Commentaire libre" rows={3} value={form.comment} onChange={(e) => set('comment', e.target.value)} className={inputCls} />
        <textarea placeholder="Points positifs" rows={2} value={form.positives} onChange={(e) => set('positives', e.target.value)} className={inputCls} />
        <textarea placeholder="Points négatifs" rows={2} value={form.negatives} onChange={(e) => set('negatives', e.target.value)} className={inputCls} />
        <textarea placeholder="Suggestions" rows={2} value={form.suggestions} onChange={(e) => set('suggestions', e.target.value)} className={inputCls} />
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={form.honest} onChange={(e) => set('honest', e.target.checked)} className="mt-1" />
          Je confirme que ce feedback est honnête et rédigé par moi-même.
        </label>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="secondary" disabled={loading} onClick={() => submit(true)}>Enregistrer brouillon</Button>
        <Button disabled={loading} onClick={() => submit(false)}>Envoyer mon feedback</Button>
      </div>
    </div>
  )
}
