import StaticPage from './StaticPage'
import Button from '../../components/Button'

const steps = [
  { n: 1, title: 'Publier une campagne', desc: 'Décrivez votre produit et le profil de testeurs recherché.' },
  { n: 2, title: 'Sélectionner les testeurs', desc: 'TestConnect identifie les profils correspondant à vos critères.' },
  { n: 3, title: 'Réaliser la mission', desc: 'Les testeurs acceptent et testent selon vos consignes.' },
  { n: 4, title: 'Collecter les retours', desc: 'Feedbacks structurés avec notes, commentaires et pièces jointes.' },
  { n: 5, title: 'Recevoir le rapport', desc: 'Synthèse anonymisée avec recommandations.' },
  { n: 6, title: 'Rémunérer les testeurs', desc: 'Paiement après validation de chaque feedback.' },
]

export default function HowItWorks() {
  return (
    <StaticPage title="Comment ça marche">
      <p>TestConnect simplifie le test produit en 6 étapes claires.</p>
      <div className="space-y-4 mt-8">
        {steps.map((s) => (
          <div key={s.n} className="card p-5 flex gap-4">
            <span className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-xs shrink-0">{s.n}</span>
            <div>
              <h3 className="font-semibold text-navy">{s.title}</h3>
              <p className="text-sm mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8"><Button to="/inscription">Commencer</Button></div>
    </StaticPage>
  )
}
