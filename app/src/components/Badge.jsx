import { STATUS_COLORS } from '../lib/constants'

export default function Badge({ status, label }) {
  const color = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${color}`}>
      {label || status}
    </span>
  )
}
