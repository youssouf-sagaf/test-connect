import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import { OFFERS, EXTRAS, PRODUCT_TYPES, calculateTotal, formatEuro } from '../../lib/constants'
import { createNotification } from '../../services/notifications'

const STEPS = ['Produit', 'Testeurs', 'Mission', 'Offre & Paiement']

export default function NewCampaign() {
  const { company, user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', product_type: 'digital', category: PRODUCT_TYPES[0],
    product_link: '', objective: '', testers_count: 5, age_min: '', age_max: '',
    location: '', device: '', interests: '', skills: '', specific_criteria: '',
    instructions: '', duration_hours: 2, start_date: '', deadline: '',
    feedback_type: 'questionnaire', screenshot: true, video: false,
    offer: 'essentiel', extras: {},
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const toggleExtra = (key) => setForm((f) => ({
    ...f,
    extras: { ...f.extras, [key]: !f.extras[key] },
  }))

  const offer = OFFERS[form.offer]
  const total = calculateTotal(form.offer, form.extras, form.testers_count || offer.testers)

  const buildPayload = (status, paid = false) => ({
    company_id: company.id,
    title: form.title,
    description: form.description,
    product_type: form.product_type,
    category: form.category,
    product_link: form.product_link,
    objective: form.objective,
    criteria: {
      age_min: form.age_min, age_max: form.age_max, location: form.location,
      device: form.device, interests: form.interests, skills: form.skills,
      specific: form.specific_criteria,
    },
    instructions: form.instructions,
    duration_hours: form.duration_hours,
    start_date: form.start_date || null,
    deadline: form.deadline || null,
    testers_count: form.testers_count || offer.testers,
    offer: form.offer,
    base_price: offer.price,
    extras: form.extras,
    total_price: total,
    status,
    paid,
  })

  const save = async (status, paid = false) => {
    if (!form.title) { setError('Le nom du produit est requis.'); return }
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.from('campaigns').insert(buildPayload(status, paid)).select().single()
    if (err) { setError(err.message); setLoading(false); return }

    if (paid) {
      await supabase.from('payments').insert({
        campaign_id: data.id,
        recipient_id: user.id,
        amount: total,
        type: 'company_campaign',
        status: 'simulated_paid',
        simulated: true,
        paid_at: new Date().toISOString(),
      })
      await createNotification(user.id, 'Paiement confirmé', `Paiement simulé de ${formatEuro(total)} pour la campagne "${form.title}".`)
    }

    if (status === 'pending_validation') {
      await createNotification(user.id, 'Campagne créée', `Votre campagne "${form.title}" est en attente de validation.`)
    }

    navigate('/entreprise/campagnes')
    setLoading(false)
  }

  const inputCls = 'w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet'

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Nouvelle campagne</h2>
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex-1 text-center text-xs py-2 rounded-full ${i <= step ? 'gradient-btn' : 'bg-gray-100 text-muted'}`}>
            {i + 1}. {s}
          </div>
        ))}
      </div>
      {error && <div className="mb-4 p-3 bg-red-50 text-error text-sm rounded-xl">{error}</div>}

      {step === 0 && (
        <div className="space-y-4">
          <input placeholder="Nom du produit *" value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} />
          <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
          <select value={form.product_type} onChange={(e) => set('product_type', e.target.value)} className={inputCls}>
            <option value="digital">Digital</option>
            <option value="physical">Physique</option>
          </select>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
            {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input placeholder="Lien vers le produit" value={form.product_link} onChange={(e) => set('product_link', e.target.value)} className={inputCls} />
          <textarea placeholder="Objectif du test" rows={2} value={form.objective} onChange={(e) => set('objective', e.target.value)} className={inputCls} />
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <input type="number" placeholder="Nombre de testeurs" value={form.testers_count} onChange={(e) => set('testers_count', Number(e.target.value))} className={inputCls} />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Âge min" value={form.age_min} onChange={(e) => set('age_min', e.target.value)} className={inputCls} />
            <input placeholder="Âge max" value={form.age_max} onChange={(e) => set('age_max', e.target.value)} className={inputCls} />
          </div>
          <input placeholder="Localisation" value={form.location} onChange={(e) => set('location', e.target.value)} className={inputCls} />
          <input placeholder="Appareil requis" value={form.device} onChange={(e) => set('device', e.target.value)} className={inputCls} />
          <input placeholder="Centres d'intérêt" value={form.interests} onChange={(e) => set('interests', e.target.value)} className={inputCls} />
          <input placeholder="Compétences" value={form.skills} onChange={(e) => set('skills', e.target.value)} className={inputCls} />
          <textarea placeholder="Critères spécifiques" rows={2} value={form.specific_criteria} onChange={(e) => set('specific_criteria', e.target.value)} className={inputCls} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <textarea placeholder="Consignes de la mission *" rows={4} value={form.instructions} onChange={(e) => set('instructions', e.target.value)} className={inputCls} />
          <input type="number" placeholder="Durée estimée (heures)" value={form.duration_hours} onChange={(e) => set('duration_hours', Number(e.target.value))} className={inputCls} />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} className={inputCls} />
            <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className={inputCls} />
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.screenshot} onChange={(e) => set('screenshot', e.target.checked)} /> Capture d&apos;écran requise</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.video} onChange={(e) => set('video', e.target.checked)} /> Vidéo optionnelle</label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {Object.values(OFFERS).map((o) => (
              <label key={o.id} className={`card p-4 cursor-pointer flex justify-between ${form.offer === o.id ? 'ring-2 ring-violet' : ''}`}>
                <div>
                  <input type="radio" name="offer" checked={form.offer === o.id} onChange={() => set('offer', o.id)} className="mr-3" />
                  <span className="font-semibold">{o.name}</span> — {formatEuro(o.price)} HT
                  {o.badge && <span className="ml-2 text-xs gradient-btn px-2 py-0.5 rounded-full">{o.badge}</span>}
                </div>
                <span className="text-sm text-muted">{o.testers} testeurs</span>
              </label>
            ))}
          </div>
          <div className="card p-4 space-y-2">
            <p className="font-semibold text-sm">Options supplémentaires</p>
            {Object.entries(EXTRAS).map(([key, ex]) => (
              <label key={key} className="flex justify-between text-sm">
                <span><input type="checkbox" checked={!!form.extras[key]} onChange={() => toggleExtra(key)} className="mr-2" />{ex.label}</span>
                <span>+{formatEuro(ex.price)}{ex.perTester ? '/testeur' : ''}</span>
              </label>
            ))}
          </div>
          <div className="card p-4 bg-violet-light">
            <div className="flex justify-between font-bold text-lg">
              <span>Total HT</span>
              <span>{formatEuro(total)}</span>
            </div>
            <p className="text-xs text-muted mt-2">Paiement simulé — aucun prélèvement réel</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-8">
        {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Précédent</Button>}
        {step < 3 && <Button onClick={() => setStep(step + 1)}>Suivant</Button>}
        {step === 3 && (
          <>
            <Button variant="secondary" disabled={loading} onClick={() => save('draft')}>Enregistrer brouillon</Button>
            <Button variant="secondary" disabled={loading} onClick={() => save('pending_validation')}>Soumettre</Button>
            <Button disabled={loading} onClick={() => save('recruiting', true)}>Payer et lancer (simulé)</Button>
          </>
        )}
      </div>
    </div>
  )
}
