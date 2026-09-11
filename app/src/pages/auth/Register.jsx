import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
export default function Register() {
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') || 'tester')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '', password: '', passwordConfirm: '', phone: '', cgu: false, rgpd: false,
    firstName: '', lastName: '', companyName: '', sector: '', size: '',
    birthDate: '', city: '', country: 'France', interests: '', devices: '', skills: '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    if (form.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
    if (form.password !== form.passwordConfirm) return 'Les mots de passe ne correspondent pas.'
    if (!form.cgu || !form.rgpd) return 'Vous devez accepter les CGU et le consentement RGPD.'
    if (role === 'company' && !form.companyName) return 'Le nom de l\'entreprise est requis.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setLoading(true)

    const { data, error: signErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          role,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
        },
      },
    })

    if (signErr) {
      setError(signErr.message.includes('already') ? 'Cet email est déjà utilisé.' : signErr.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').update({
        first_name: form.firstName, last_name: form.lastName, phone: form.phone, status: 'active',
      }).eq('id', data.user.id)

      if (role === 'company') {
        await supabase.from('companies').insert({
          user_id: data.user.id, name: form.companyName, sector: form.sector, size: form.size, status: 'active',
        })
      } else {
        await supabase.from('tester_profiles').insert({
          user_id: data.user.id,
          birth_date: form.birthDate || null,
          city: form.city,
          country: form.country,
          interests: form.interests ? form.interests.split(',').map((s) => s.trim()) : [],
          devices: form.devices ? form.devices.split(',').map((s) => s.trim()) : [],
          skills: form.skills ? form.skills.split(',').map((s) => s.trim()) : [],
        })
      }
    }

    navigate(role === 'company' ? '/entreprise' : '/testeur')
    setLoading(false)
  }

  const inputCls = 'w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet'

  return (
    <div className="min-h-screen py-12 px-4 bg-bg">
      <div className="card max-w-lg mx-auto p-8">
        <div className="flex justify-center mb-6"><Logo link={false} className="h-12" /></div>
        <h1 className="text-2xl font-bold text-center">Inscription</h1>
        <div className="flex gap-2 mt-6">
          {['company', 'tester'].map((r) => (
            <button key={r} type="button" onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-full text-sm font-medium ${role === r ? 'gradient-btn' : 'bg-gray-100 text-muted'}`}>
              {r === 'company' ? 'Entreprise' : 'Testeur'}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <div className="p-3 bg-red-50 text-error text-sm rounded-xl">{error}</div>}
          {role === 'company' ? (
            <>
              <input placeholder="Nom de l'entreprise *" required value={form.companyName} onChange={(e) => set('companyName', e.target.value)} className={inputCls} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Prénom responsable *" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputCls} />
                <input placeholder="Nom responsable *" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputCls} />
              </div>
              <input placeholder="Secteur d'activité" value={form.sector} onChange={(e) => set('sector', e.target.value)} className={inputCls} />
              <select value={form.size} onChange={(e) => set('size', e.target.value)} className={inputCls}>
                <option value="">Taille de l'entreprise</option>
                {['1-10', '11-50', '51-200', '200+'].map((s) => <option key={s} value={s}>{s} employés</option>)}
              </select>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Prénom *" required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputCls} />
                <input placeholder="Nom *" required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputCls} />
              </div>
              <input type="date" placeholder="Date de naissance" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} className={inputCls} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Ville" value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} />
                <input placeholder="Pays" value={form.country} onChange={(e) => set('country', e.target.value)} className={inputCls} />
              </div>
              <input placeholder="Centres d'intérêt (séparés par virgule)" value={form.interests} onChange={(e) => set('interests', e.target.value)} className={inputCls} />
              <input placeholder="Appareils (iPhone, Android...)" value={form.devices} onChange={(e) => set('devices', e.target.value)} className={inputCls} />
              <input placeholder="Compétences" value={form.skills} onChange={(e) => set('skills', e.target.value)} className={inputCls} />
            </>
          )}
          <input type="email" placeholder="Email *" required value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
          <input type="tel" placeholder="Téléphone" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
          <input type="password" placeholder="Mot de passe (8 car. min) *" required value={form.password} onChange={(e) => set('password', e.target.value)} className={inputCls} />
          <input type="password" placeholder="Confirmer le mot de passe *" required value={form.passwordConfirm} onChange={(e) => set('passwordConfirm', e.target.value)} className={inputCls} />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={form.cgu} onChange={(e) => set('cgu', e.target.checked)} className="mt-1" />
            J&apos;accepte les <Link to="/cgu" className="text-violet">CGU</Link>
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={form.rgpd} onChange={(e) => set('rgpd', e.target.checked)} className="mt-1" />
            Je consens au traitement de mes données (RGPD)
          </label>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Inscription...' : 'Créer mon compte'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Déjà inscrit ? <Link to="/connexion" className="text-violet font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
