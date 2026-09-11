import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted max-w-sm">
              TestConnect met en relation les entreprises avec des testeurs vérifiés pour obtenir des retours concrets avant le lancement d&apos;un produit.
            </p>
            <p className="mt-2 text-xs text-muted italic">Des produits meilleurs grâce à vos avis</p>
          </div>
          <div>
            <h4 className="font-semibold text-navy mb-3">Plateforme</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/comment-ca-marche" className="hover:text-violet">Comment ça marche</Link></li>
              <li><Link to="/tarifs" className="hover:text-violet">Tarifs</Link></li>
              <li><Link to="/faq" className="hover:text-violet">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-navy mb-3">Légal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/mentions-legales" className="hover:text-violet">Mentions légales</Link></li>
              <li><Link to="/confidentialite" className="hover:text-violet">Confidentialité</Link></li>
              <li><Link to="/cgu" className="hover:text-violet">CGU</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted">
          © {new Date().getFullYear()} TestConnect — Données de démonstration
        </div>
      </div>
    </footer>
  )
}
