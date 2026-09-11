import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Logo from '../../components/Logo'
import Button from '../../components/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : err.message)
      setLoading(false)
      return
    }
    const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    const routes = { company: '/entreprise', tester: '/testeur', admin: '/admin' }
    navigate(routes[prof?.role] || '/')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="card w-full max-w-md p-8">
        <div className="flex justify-center mb-6"><Logo link={false} className="h-12" /></div>
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <div className="p-3 bg-red-50 text-error text-sm rounded-xl">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Pas de compte ? <Link to="/inscription" className="text-violet font-medium">S&apos;inscrire</Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to="/mot-de-passe-oublie" className="text-muted hover:text-violet">Mot de passe oublié</Link>
        </p>
      </div>
    </div>
  )
}
