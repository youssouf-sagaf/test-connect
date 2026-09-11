import { OFFERS, formatEuro } from '../../lib/constants'
import Button from '../../components/Button'

export default function Pricing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-4">Tarifs</h1>
      <p className="text-center text-muted mb-12">Trois offres adaptées à vos besoins de test</p>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.values(OFFERS).map((offer) => (
          <div key={offer.id} className={`card p-8 relative ${offer.badge ? 'ring-2 ring-violet' : ''}`}>
            {offer.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-btn text-xs rounded-full">
                {offer.badge}
              </span>
            )}
            <h2 className="text-xl font-bold">{offer.name}</h2>
            <p className="text-3xl font-bold mt-4">{formatEuro(offer.price)} <span className="text-sm font-normal text-muted">HT</span></p>
            <p className="text-sm text-muted mt-2">Délai : {offer.delay}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {offer.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-violet">✓</span>{f}</li>
              ))}
            </ul>
            <Button to="/inscription?role=company" className="w-full mt-8">Choisir {offer.name}</Button>
          </div>
        ))}
      </div>
      <div className="mt-16 overflow-x-auto">
        <table className="w-full text-sm card">
          <thead>
            <tr className="border-b border-border">
              {['', 'Essentiel', 'Validation', 'Approfondie'].map((h) => (
                <th key={h} className="p-4 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Prix HT', '199 €', '349 €', '549 €'],
              ['Testeurs', '5', '10', '15'],
              ['Ciblage', 'Standard', 'Profils ciblés', 'Panel ciblé'],
              ['Rapport', 'Synthèse', 'Consolidé', 'Détaillé'],
              ['Support', 'Standard', 'Prioritaire', 'Personnalisé'],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-border">
                {row.map((cell, i) => <td key={i} className="p-4">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
