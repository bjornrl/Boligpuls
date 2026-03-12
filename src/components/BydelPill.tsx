'use client'

interface BydelPillProps {
  name: string
  emoji?: string
  color: string
  size?: 'sm' | 'md'
}

export default function BydelPill({ name, emoji, color, size = 'sm' }: BydelPillProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizeClasses}`}
      style={{
        backgroundColor: `${color}12`,
        color: color,
        border: `1px solid ${color}20`,
      }}
    >
      {emoji && <span>{emoji}</span>}
      {name}
    </span>
  )
}
