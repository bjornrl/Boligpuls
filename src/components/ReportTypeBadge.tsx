'use client'

import { reportTypeConfig, type ReportType } from '@/sanity/types'

export default function ReportTypeBadge({ type, size = 'sm' }: { type: ReportType; size?: 'sm' | 'md' }) {
  const config = reportTypeConfig[type]
  if (!config) return null

  const padding = size === 'md' ? 'px-3 py-1' : 'px-2 py-0.5'
  const fontSize = size === 'md' ? 'text-sm' : 'text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} ${fontSize} font-medium rounded-full`}
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
    >
      {config.emoji} {config.label}
    </span>
  )
}
