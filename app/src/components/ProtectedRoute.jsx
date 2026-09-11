import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) return <Navigate to="/connexion" replace />
  if (roles && !roles.includes(profile?.role)) {
    const redirect = profile?.role === 'company' ? '/entreprise'
      : profile?.role === 'tester' ? '/testeur'
      : profile?.role === 'admin' ? '/admin' : '/'
    return <Navigate to={redirect} replace />
  }

  return children
}
