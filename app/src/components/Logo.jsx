import { Link } from 'react-router-dom'

export default function Logo({ className = 'h-10', link = true }) {
  const img = (
    <img src="/logo.jpeg" alt="TestConnect" className={`${className} object-contain`} />
  )
  return link ? <Link to="/" className="inline-flex shrink-0">{img}</Link> : img
}
