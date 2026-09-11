export default function StaticPage({ title, children }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-navy mb-8">{title}</h1>
      <div className="prose prose-sm text-muted space-y-4">{children}</div>
    </div>
  )
}
