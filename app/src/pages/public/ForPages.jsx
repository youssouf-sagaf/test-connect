import StaticPage from './StaticPage'
import Button from '../../components/Button'

export function ForCompanies() {
  return (
    <StaticPage title="Pour les entreprises">
      <p>TestConnect vous aide à valider vos produits avant le lancement avec des testeurs vérifiés.</p>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li>Trouver des testeurs fiables selon vos critères</li>
        <li>Gagner du temps avec des retours structurés</li>
        <li>Tester produits digitaux et physiques</li>
        <li>Réduire les risques avant le lancement</li>
      </ul>
      <Button to="/inscription?role=company" className="mt-8">Créer une campagne</Button>
    </StaticPage>
  )
}

export function ForTesters() {
  return (
    <StaticPage title="Pour les testeurs">
      <p>Rejoignez une communauté en construction et testez des produits innovants.</p>
      <ul className="list-disc pl-5 space-y-2 mt-4">
        <li>Missions adaptées à votre profil</li>
        <li>Rémunération entre 10 € et 15 € par mission</li>
        <li>Suivi de vos missions et gains</li>
        <li>Construisez votre réputation de testeur</li>
      </ul>
      <Button to="/inscription?role=tester" className="mt-8">Devenir testeur</Button>
    </StaticPage>
  )
}
