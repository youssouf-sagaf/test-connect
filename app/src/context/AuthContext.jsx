import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [company, setCompany] = useState(null)
  const [testerProfile, setTesterProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId) => {
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(prof)

    if (prof?.role === 'company') {
      const { data: comp } = await supabase.from('companies').select('*').eq('user_id', userId).single()
      setCompany(comp)
      setTesterProfile(null)
    } else if (prof?.role === 'tester') {
      const { data: tp } = await supabase.from('tester_profiles').select('*').eq('user_id', userId).single()
      setTesterProfile(tp)
      setCompany(null)
    } else {
      setCompany(null)
      setTesterProfile(null)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id).finally(() => setLoading(false))
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else {
        setProfile(null)
        setCompany(null)
        setTesterProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [loadProfile])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setCompany(null)
    setTesterProfile(null)
  }

  const refreshProfile = () => user && loadProfile(user.id)

  return (
    <AuthContext.Provider value={{
      user, profile, company, testerProfile, loading, signOut, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
