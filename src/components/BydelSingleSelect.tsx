'use client'

import { Bydel } from '@/types/index'

interface BydelSingleSelectProps {
  bydeler: Bydel[]
  selected: string
  onChange: (id: string) => void
}

export default function BydelSingleSelect({ bydeler, selected, onChange }: BydelSingleSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {bydeler.map((bydel) => {
        const isSelected = selected === bydel.id
        return (
          <button
            key={bydel.id}
            type="button"
            onClick={() => onChange(bydel.id)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={
              isSelected
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
        )
      })}
    </div>
  )
}
