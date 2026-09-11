import { supabase } from '../lib/supabase'

export async function createNotification(userId, title, message) {
  return supabase.from('notifications').insert({ user_id: userId, title, message })
}

export async function getNotifications(userId) {
  return supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20)
}

export async function markNotificationRead(id) {
  return supabase.from('notifications').update({ read: true }).eq('id', id)
}
