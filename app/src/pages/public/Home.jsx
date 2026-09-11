import Button from '../../components/Button'
import PhoneMockup from '../../components/PhoneMockup'

const steps = [
  'Publier une campagne', 'Sélectionner les testeurs', 'Réaliser la mission',
  'Collecter les retours', 'Recevoir le rapport', 'Rémunérer les testeurs',
]

const trustItems = ['Testeurs vérifiés', 'Retours structurés', 'Paiements sécurisés', 'Une communauté en construction']

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="organic-blob w-96 h-96 bg-violet -top-20 -left-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold tracking-widest text-violet mb-4">CONNECTER · TESTER · AMÉLIORER</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-navy leading-tight">
              Testez mieux, <span className="gradient-text">lancez plus vite</span>
            </h1>
            <p className="mt-6 text-lg text-muted">
              TestConnect met en relation les entreprises avec des testeurs vérifiés pour obtenir des retours concrets avant le lancement d&apos;un produit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button to="/inscription?role=company">Je suis une entreprise</Button>
              <Button to="/inscription?role=tester" variant="secondary">Je veux devenir testeur</Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {trustItems.map((t) => (
                <span key={t} className="px-4 py-2 bg-white border border-border rounded-full text-sm text-muted">{t}</span>
              ))}
            </div>
          </div>
          <PhoneMockup />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Trois bénéfices clés</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Des testeurs réels et engagés', desc: 'Une communauté en construction, sélectionnée selon vos critères.' },
              { title: 'Des retours concrets et rapides', desc: 'Feedbacks structurés pour décider plus vite.' },
              { title: 'Des produits meilleurs demain', desc: 'Réduisez les risques avant le lancement.' },
            ].map((b) => (
              <div key={b.title} className="card p-6">
                <h3 className="font-semibold text-navy">{b.title}</h3>
                <p className="mt-2 text-sm text-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s} className="card p-6 flex gap-4">
                <span className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center text-sm shrink-0">{i + 1}</span>
                <p className="font-medium">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-violet-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="card p-8">
            <h2 className="text-xl font-bold">Pour les entreprises</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {['Trouver des testeurs fiables', 'Gagner du temps', 'Feedbacks structurés', 'Produits digitaux et physiques', 'Réduire les risques'].map((i) => (
                <li key={i} className="flex gap-2"><span className="text-violet">✓</span>{i}</li>
              ))}
            </ul>
            <Button to="/inscription?role=company" className="mt-6">Créer une campagne</Button>
          </div>
          <div className="card p-8">
            <h2 className="text-xl font-bold">Pour les testeurs</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {['Missions adaptées', 'Produits innovants', 'Rémunération 10 € à 15 €', 'Suivi missions et gains', 'Construire une réputation'].map((i) => (
                <li key={i} className="flex gap-2"><span className="text-pink">✓</span>{i}</li>
              ))}
            </ul>
            <Button to="/inscription?role=tester" variant="secondary" className="mt-6">Devenir testeur</Button>
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold">Prêt à améliorer votre prochain produit ?</h2>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button to="/inscription?role=company">Je suis une entreprise</Button>
          <Button to="/inscription?role=tester" variant="secondary">Je veux devenir testeur</Button>
        </div>
      </section>
    </>
  )
}
