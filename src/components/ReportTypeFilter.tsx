'use client'

import { reportTypeConfig, type ReportType } from '@/sanity/types'

interface ReportTypeFilterProps {
  selected: ReportType | null
  onChange: (type: ReportType | null) => void
}

const filterOptions: { label: string; value: ReportType | null }[] = [
  { label: 'Alle', value: null },
  { label: '📊 Ukesrapport', value: 'ukentlig' },
  { label: '📈 Månedsrapport', value: 'manedlig' },
  { label: '📋 Kvartalsrapport', value: 'kvartal' },
  { label: '📑 Årsrapport', value: 'arsrapport' },
]

export default function ReportTypeFilter({ selected, onChange }: ReportTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((opt) => {
        const isActive = selected === opt.value
        const config = opt.value ? reportTypeConfig[opt.value] : null
        return (
          <button
            key={opt.value || 'all'}
            onClick={() => onChange(opt.value)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={
              isActive
                ? config
                  ? { backgroundColor: `${config.color}18`, color: config.color, border: `1px solid ${config.color}` }
                  : { backgroundColor: '#002D32', color: '#FFFFFF' }
                : { backgroundColor: '#FFFFFF', color: '#9BAFB2', border: '1px solid #D4DCDE' }
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
