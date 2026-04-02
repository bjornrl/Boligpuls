'use client'

import type { ReportType } from '@/sanity/types'
import { reportTypeConfig } from '@/sanity/types'

interface ReportTypeFilterProps {
  selected: ReportType | null
  onChange: (type: ReportType | null) => void
}

const filterOptions: { label: string; value: ReportType | null; color?: string }[] = [
  { label: 'Alle', value: null },
  { label: '📊 Ukentlig', value: 'ukentlig', color: reportTypeConfig.ukentlig.color },
  { label: '📈 Månedlig', value: 'manedlig', color: reportTypeConfig.manedlig.color },
  { label: '📋 Kvartalsrapport', value: 'kvartal', color: reportTypeConfig.kvartal.color },
  { label: '📑 Årsrapport', value: 'arsrapport', color: reportTypeConfig.arsrapport.color },
]

export default function ReportTypeFilter({ selected, onChange }: ReportTypeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterOptions.map((opt) => {
        const isActive = selected === opt.value
        const isAll = opt.value === null
        const color = opt.color || '#002D32'
        return (
          <button
            key={opt.value || 'all'}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !isActive
                ? 'bg-white text-[#9BAFB2] border border-[#D4DCDE] hover:border-[#9BAFB2] hover:text-[#5F7A7D] hover:bg-[#FAFAF9]'
                : ''
            }`}
            style={
              isActive
                ? isAll
                  ? { backgroundColor: '#002D32', color: '#FFFFFF' }
                  : { backgroundColor: `${color}18`, color, border: `1px solid ${color}` }
                : undefined
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
