import { Link } from 'react-router-dom'

export default function Button({
  children, variant = 'primary', to, href, className = '', disabled, type = 'button', onClick,
}) {
  const base = 'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition-all rounded-full'
  const variants = {
    primary: 'gradient-btn',
    secondary: 'bg-white text-navy border border-border hover:bg-violet-light',
    ghost: 'bg-transparent text-navy hover:bg-violet-light',
    danger: 'bg-error text-white hover:opacity-90',
  }
  const cls = `${base} ${variants[variant]} ${className}`

  if (to) return <Link to={to} className={cls}>{children}</Link>
  if (href) return <a href={href} className={cls}>{children}</a>
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
