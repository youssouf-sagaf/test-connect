export const OFFERS = {
  essentiel: {
    id: 'essentiel',
    name: 'Essentiel',
    price: 199,
    testers: 5,
    reward: 10,
    delay: '5 à 7 jours ouvrés',
    features: [
      '5 testeurs vérifiés',
      'Test simple site, app ou produit',
      'Rémunération : 10 € par testeur',
      'Questionnaire structuré',
      'Feedbacks vérifiés',
      'Rapport de synthèse',
      'Support standard',
    ],
  },
  validation: {
    id: 'validation',
    name: 'Validation',
    price: 349,
    testers: 10,
    reward: 10,
    delay: '7 à 10 jours ouvrés',
    badge: 'La plus choisie',
    features: [
      '10 testeurs vérifiés',
      'Profils ciblés',
      'Mission plus détaillée',
      'Questionnaire personnalisé',
      'Captures d\'écran',
      'Rapport consolidé',
      'Support prioritaire',
    ],
  },
  approfondie: {
    id: 'approfondie',
    name: 'Approfondie',
    price: 549,
    testers: 15,
    reward: 15,
    delay: '10 à 14 jours ouvrés',
    features: [
      '15 testeurs vérifiés',
      'Panel ciblé',
      'Scénario approfondi',
      'Feedbacks détaillés',
      'Captures d\'écran',
      'Vidéo optionnelle',
      'Analyse des résultats',
      'Recommandations prioritaires',
      'Rapport détaillé',
      'Accompagnement personnalisé',
    ],
  },
}

export const EXTRAS = {
  extra_tester: { label: 'Testeur supplémentaire', price: 30 },
  urgent_matching: { label: 'Matching urgent', price: 49 },
  targeted_panel: { label: 'Panel ciblé', price: 79 },
  detailed_report: { label: 'Rapport détaillé', price: 99 },
  video_feedback: { label: 'Feedback vidéo (par testeur)', price: 15, perTester: true },
}

export const CAMPAIGN_STATUS_LABELS = {
  draft: 'Brouillon',
  pending_validation: 'En attente de validation',
  recruiting: 'En recrutement',
  in_progress: 'En cours',
  feedbacks_pending: 'Feedbacks à valider',
  completed: 'Terminée',
  cancelled: 'Annulée',
}

export const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-700',
  pending_validation: 'bg-orange-100 text-orange-700',
  recruiting: 'bg-violet-light text-violet',
  in_progress: 'bg-blue-100 text-blue-700',
  feedbacks_pending: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-orange-100 text-orange-700',
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  submitted: 'bg-orange-100 text-orange-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  simulated_paid: 'bg-violet-light text-violet',
}

export const PRODUCT_TYPES = ['Site web', 'Application mobile', 'Logiciel', 'Prototype', 'Jeu vidéo', 'Cosmétique', 'Alimentaire', 'Accessoire', 'Objet connecté', 'Autre']

export function calculateTotal(offerId, extras = {}, testersCount) {
  const offer = OFFERS[offerId]
  if (!offer) return 0
  let total = offer.price
  if (extras.extra_tester) total += EXTRAS.extra_tester.price * (extras.extra_tester_qty || 1)
  if (extras.urgent_matching) total += EXTRAS.urgent_matching.price
  if (extras.targeted_panel) total += EXTRAS.targeted_panel.price
  if (extras.detailed_report) total += EXTRAS.detailed_report.price
  if (extras.video_feedback) total += EXTRAS.video_feedback.price * (testersCount || offer.testers)
  return Math.max(total, offer.price)
}

export function formatEuro(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}
