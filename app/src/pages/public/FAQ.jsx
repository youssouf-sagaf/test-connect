import { useState } from 'react'
import StaticPage from './StaticPage'

const faqs = [
  { q: 'Comment fonctionne TestConnect ?', a: 'Les entreprises créent des campagnes de test. Les testeurs vérifiés réalisent les missions et envoient leurs feedbacks. L\'entreprise reçoit un rapport de synthèse.' },
  { q: 'Combien coûte une campagne ?', a: 'Trois offres : Essentiel (199 € HT), Validation (349 € HT) et Approfondie (549 € HT).' },
  { q: 'Combien gagnent les testeurs ?', a: 'Entre 10 € et 15 € par mission, selon l\'offre et la complexité.' },
  { q: 'Les paiements sont-ils réels ?', a: 'En phase de lancement, les paiements sont simulés. Cela est clairement indiqué dans l\'espace paiements.' },
  { q: 'Quels produits peut-on tester ?', a: 'Sites web, applications, logiciels, prototypes, jeux, cosmétiques, alimentaire, accessoires, objets connectés et plus.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <StaticPage title="FAQ">
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="card overflow-hidden">
            <button type="button" className="w-full p-5 text-left font-semibold flex justify-between" onClick={() => setOpen(open === i ? null : i)}>
              {f.q}
              <span>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="px-5 pb-5 text-sm">{f.a}</p>}
          </div>
        ))}
      </div>
    </StaticPage>
  )
}
