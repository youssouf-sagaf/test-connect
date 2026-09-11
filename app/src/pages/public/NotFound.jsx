import Button from '../../components/Button'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-32 text-center">
      <h1 className="text-6xl font-bold gradient-text">404</h1>
      <p className="mt-4 text-muted">Cette page n&apos;existe pas.</p>
      <Button to="/" className="mt-8">Retour à l&apos;accueil</Button>
    </div>
  )
}
