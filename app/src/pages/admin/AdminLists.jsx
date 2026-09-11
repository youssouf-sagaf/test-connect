import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { CAMPAIGN_STATUS_LABELS, formatEuro } from '../../lib/constants'

export function AdminCompanies() {
  const [items, setItems] = useState([])
  useEffect(() => {
    supabase.from('companies').select('*, profiles(email, first_name, last_name)').then(({ data }) => setItems(data || []))
  }, [])
  const toggle = async (id, status) => {
    await supabase.from('companies').update({ status }).eq('id', id)
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i))
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Entreprises</h2>
      <div className="space-y-3">{items.map((c) => (
        <div key={c.id} className="card p-4 flex justify-between items-center">
          <div><p className="font-medium">{c.name}</p><p className="text-sm text-muted">{c.profiles?.email}</p></div>
          <div className="flex gap-2 items-center">
            <Badge status={c.status} label={c.status} />
            {c.status !== 'active' && <Button variant="secondary" onClick={() => toggle(c.id, 'active')}>Approuver</Button>}
            {c.status !== 'suspended' && <Button variant="ghost" onClick={() => toggle(c.id, 'suspended')}>Suspendre</Button>}
          </div>
        </div>
      ))}</div>
    </div>
  )
}

export function AdminTesters() {
  const [items, setItems] = useState([])
  useEffect(() => {
    supabase.from('tester_profiles').select('*, profiles(email, first_name, last_name, status)').then(({ data }) => setItems(data || []))
  }, [])
  const verify = async (id, verified) => {
    await supabase.from('tester_profiles').update({ verified }).eq('id', id)
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, verified } : i))
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Testeurs</h2>
      <div className="space-y-3">{items.map((t) => (
        <div key={t.id} className="card p-4 flex justify-between items-center">
          <div><p className="font-medium">{t.profiles?.first_name} {t.profiles?.last_name}</p><p className="text-sm text-muted">{t.city} · {t.profiles?.email}</p></div>
          <div className="flex gap-2">
            {t.verified ? <Badge status="active" label="Vérifié" /> : <Button variant="secondary" onClick={() => verify(t.id, true)}>Vérifier profil</Button>}
          </div>
        </div>
      ))}</div>
    </div>
  )
}

export function AdminCampaigns() {
  const [items, setItems] = useState([])
  useEffect(() => {
    supabase.from('campaigns').select('*, companies(name)').order('created_at', { ascending: false }).then(({ data }) => setItems(data || []))
  }, [])
  const setStatus = async (id, status) => {
    await supabase.from('campaigns').update({ status }).eq('id', id)
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i))
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Campagnes</h2>
      <div className="space-y-3">{items.map((c) => (
        <div key={c.id} className="card p-4">
          <div className="flex justify-between"><p className="font-medium">{c.title}</p><Badge status={c.status} label={CAMPAIGN_STATUS_LABELS[c.status]} /></div>
          <p className="text-sm text-muted">{c.companies?.name} · {formatEuro(c.total_price)}</p>
          <div className="flex gap-2 mt-3">
            {c.status === 'pending_validation' && <Button onClick={() => setStatus(c.id, 'recruiting')}>Valider</Button>}
            {c.status === 'feedbacks_pending' && <Button onClick={() => setStatus(c.id, 'completed')}>Terminer</Button>}
            <Button variant="ghost" onClick={() => setStatus(c.id, 'cancelled')}>Annuler</Button>
          </div>
        </div>
      ))}</div>
    </div>
  )
}

export function AdminPayments() {
  const [items, setItems] = useState([])
  useEffect(() => {
    supabase.from('payments').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data || []))
  }, [])
  const trigger = async (id) => {
    await supabase.from('payments').update({ status: 'simulated_paid', paid_at: new Date().toISOString() }).eq('id', id)
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: 'simulated_paid' } : i))
  }
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Paiements</h2>
      <p className="text-sm text-warning mb-6">Mode simulation activé</p>
      <div className="space-y-3">{items.map((p) => (
        <div key={p.id} className="card p-4 flex justify-between items-center">
          <span>{formatEuro(p.amount)} — {p.type}</span>
          <div className="flex gap-2 items-center">
            <Badge status={p.status} label={p.simulated ? 'Simulé' : p.status} />
            {p.status === 'pending' && <Button variant="secondary" onClick={() => trigger(p.id)}>Déclencher paiement</Button>}
          </div>
        </div>
      ))}</div>
    </div>
  )
}

export function AdminDisputes() {
  const [items, setItems] = useState([])
  useEffect(() => {
    supabase.from('disputes').select('*, campaigns(title)').then(({ data }) => setItems(data || []))
  }, [])
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Litiges</h2>
      {items.length === 0 ? <p className="text-muted">Aucun litige ouvert.</p> : items.map((d) => (
        <div key={d.id} className="card p-4 mb-3">
          <p className="font-medium">{d.campaigns?.title}</p>
          <p className="text-sm text-muted">{d.reason} — {d.description}</p>
          <Badge status={d.status} label={d.status} />
        </div>
      ))}
    </div>
  )
}
