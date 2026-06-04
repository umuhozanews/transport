const PALETTE = [
  '#0A2558', '#065F46', '#5B21B6', '#92400E',
  '#9F1239', '#075985', '#166534', '#7C2D12', '#1E3A5F',
]

function colorFor(name: string) {
  const sum = name.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  return PALETTE[sum % PALETTE.length]
}

function initialsOf(name: string) {
  return name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-sm' }

export default function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 select-none ${className}`}
      style={{ backgroundColor: colorFor(name) }}
      title={name}
    >
      {initialsOf(name)}
    </div>
  )
}
