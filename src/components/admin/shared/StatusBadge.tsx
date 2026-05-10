interface Props {
  status: 'active' | 'pending' | 'inactive' | 'completed' | 'cancelled'
  variant?: 'default' | 'success' | 'warning' | 'error'
}

const statusConfig = {
  active: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' },
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
  inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Inactive' },
  completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Completed' },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelled' },
}

export default function StatusBadge({ status, variant }: Props) {
  const config = statusConfig[status]

  return (
    <span className={`px-2 py-1 ${config.bg} ${config.text} rounded text-xs font-medium`}>
      {config.label}
    </span>
  )
}
