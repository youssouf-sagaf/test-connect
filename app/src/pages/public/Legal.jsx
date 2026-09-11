import StaticPage from './StaticPage'

export function MentionsLegales() {
  return (
    <StaticPage title="Mentions légales">
      <p><strong>Éditeur :</strong> TestConnect — Projet fictif, lancement prévu en 2027.</p>
      <p><strong>Hébergement :</strong> Supabase / Vercel</p>
      <p>Données de démonstration — contact : contact@testconnect.fr</p>
    </StaticPage>
  )
}

export function Confidentialite() {
  return (
    <StaticPage title="Politique de confidentialité">
      <p>TestConnect respecte le RGPD. Vos données personnelles sont utilisées uniquement pour le fonctionnement de la plateforme.</p>
      <p>Vous pouvez demander l&apos;export ou la suppression de vos données depuis votre espace paramètres.</p>
      <p>Consentement RGPD requis à l&apos;inscription.</p>
    </StaticPage>
  )
}

export function CGU() {
  return (
    <StaticPage title="Conditions générales d'utilisation">
      <p>En utilisant TestConnect, vous acceptez nos conditions d&apos;utilisation.</p>
      <p>Les entreprises s&apos;engagent à payer avant le lancement d&apos;une campagne. Les testeurs s&apos;engagent à fournir des feedbacks honnêtes.</p>
      <p>Paiements simulés en phase de démonstration.</p>
    </StaticPage>
  )
}
