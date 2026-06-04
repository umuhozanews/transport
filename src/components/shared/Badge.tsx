interface BadgeProps {
  label: string
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'navy' | 'orange' | 'green'
}

const styles: Record<BadgeProps['variant'], string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-600',
  navy: 'bg-[#0A2558] text-white',
  orange: 'bg-orange-500 text-white',
  green: 'bg-emerald-600 text-white',
}

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {label}
    </span>
  )
}
