'use client'

import { reportTypeConfig, type ReportType } from '@/sanity/types'

export default function ReportTypeBadge({
  type,
  size = 'sm',
  color,
}: {
  type: ReportType
  size?: 'sm' | 'md'
  color?: string
}) {
  const config = reportTypeConfig[type]
  if (!config) return null
  const accentColor = color || config.color

  const padding = size === 'md' ? 'px-3 py-1' : 'px-2 py-0.5'
  const fontSize = size === 'md' ? 'text-sm' : 'text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1 ${padding} ${fontSize} font-medium rounded-full`}
      style={{
        backgroundColor: `${accentColor}15`,
        color: accentColor,
        border: `1px solid ${accentColor}30`,
      }}
    >
      {config.label}
    </span>
  )
}
