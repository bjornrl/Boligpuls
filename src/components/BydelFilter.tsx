'use client'

import { Bydel } from '@/types/index'

interface BydelFilterProps {
  bydeler: Bydel[]
  selected: string | null
  onChange: (slug: string | null) => void
}

export default function BydelFilter({ bydeler, selected, onChange }: BydelFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className="px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={
          selected === null
            ? { backgroundColor: '#1C1917', color: '#FFFFFF' }
            : { backgroundColor: 'transparent', color: '#78716C', border: '1px solid #EDEBE8' }
        }
      >
        Alle
      </button>
      {bydeler.map((bydel) => (
        <button
          key={bydel.slug}
          onClick={() => onChange(bydel.slug === selected ? null : bydel.slug)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={
            selected === bydel.slug
              ? { backgroundColor: bydel.color, color: '#FFFFFF' }
              : {
                  backgroundColor: `${bydel.color}12`,
                  color: bydel.color,
                  border: `1px solid ${bydel.color}20`,
                }
          }
        >
          {bydel.emoji} {bydel.name}
        </button>
      ))}
    </div>
  )
}
