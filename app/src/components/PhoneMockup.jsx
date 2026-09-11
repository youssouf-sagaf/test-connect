export default function PhoneMockup() {
  return (
    <div className="relative">
      <div className="organic-blob w-64 h-64 bg-violet top-0 right-0" />
      <div className="organic-blob w-48 h-48 bg-pink bottom-0 left-0" />
      <div className="relative mx-auto w-[280px] bg-navy rounded-[40px] p-3 shadow-2xl">
        <div className="bg-white rounded-[32px] overflow-hidden min-h-[520px]">
          <div className="bg-gradient-to-r from-violet to-pink p-4 text-white text-center">
            <img src="/logo.jpeg" alt="" className="h-8 mx-auto mb-2 object-contain brightness-0 invert" />
            <p className="text-xs opacity-90">Mes missions</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="card p-3">
              <p className="text-xs text-muted">Projet fictif</p>
              <p className="font-semibold text-sm">App mobile — UX</p>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-success font-medium">10 €</span>
                <span className="text-muted">2h</span>
              </div>
            </div>
            <div className="card p-3 opacity-70">
              <p className="text-xs text-muted">Exemple de feedback</p>
              <p className="font-semibold text-sm">Site e-commerce</p>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-success font-medium">15 €</span>
                <span className="text-muted">3h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -left-8 card px-4 py-3 shadow-lg animate-pulse">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">★★★★★</span>
          <span className="text-xs font-medium">Exemple d&apos;avis</span>
        </div>
      </div>
      <div className="absolute -bottom-2 -right-6 card px-4 py-2 shadow-lg">
        <span className="text-xs font-semibold text-success">✓ Test validé</span>
      </div>
    </div>
  )
}
