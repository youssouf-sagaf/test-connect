import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Logo from '../../components/Logo'
import Button from '../../components/Button'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/connexion`,
    })
    if (err) setError(err.message)
    else setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg">
      <div className="card w-full max-w-md p-8">
        <div className="flex justify-center mb-6"><Logo link={false} className="h-12" /></div>
        <h1 className="text-2xl font-bold text-center">Mot de passe oublié</h1>
        {sent ? (
          <p className="mt-6 text-center text-muted">Un email de réinitialisation a été envoyé si le compte existe.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && <div className="p-3 bg-red-50 text-error text-sm rounded-xl">{error}</div>}
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl" />
            <Button type="submit" className="w-full">Envoyer le lien</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm"><Link to="/connexion" className="text-violet">Retour connexion</Link></p>
      </div>
    </div>
  )
}
