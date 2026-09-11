import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { formatEuro } from '../../lib/constants'
import { createNotification } from '../../services/notifications'

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([])

  const load = () => {
    supabase.from('feedbacks').select('*, campaigns(title), tester_profiles(user_id)')
      .order('created_at', { ascending: false }).then(({ data }) => setFeedbacks(data || []))
  }

  useEffect(() => { load() }, [])

  const validate = async (fb, approved) => {
    const status = approved ? 'approved' : 'rejected'
    await supabase.from('feedbacks').update({ status, validated_at: new Date().toISOString() }).eq('id', fb.id)

    if (approved) {
      const userId = fb.tester_profiles?.user_id
      if (userId) {
        await supabase.from('payments').insert({
          campaign_id: fb.campaign_id,
          recipient_id: userId,
          amount: 10,
          type: 'tester_reward',
          status: 'simulated_paid',
          simulated: true,
          paid_at: new Date().toISOString(),
        })
        await createNotification(userId, 'Feedback validé', 'Votre feedback a été validé. Paiement simulé déclenché.')
      }
    } else {
      const userId = fb.tester_profiles?.user_id
      if (userId) await createNotification(userId, 'Feedback refusé', 'Votre feedback a été refusé. Contactez le support.')
    }
    load()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p className="text-muted">Aucun feedback.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{fb.campaigns?.title}</p>
                  <p className="text-sm text-muted">★ {fb.rating}/5 — {fb.comment?.slice(0, 100)}</p>
                </div>
                <Badge status={fb.status} label={fb.status} />
              </div>
              {fb.status === 'submitted' && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => validate(fb, true)}>Valider (+ {formatEuro(10)} simulé)</Button>
                  <Button variant="secondary" onClick={() => validate(fb, false)}>Refuser</Button>
                  <Button variant="ghost" onClick={() => supabase.from('feedbacks').update({ status: 'correction_requested' }).eq('id', fb.id).then(load)}>
                    Demander correction
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
