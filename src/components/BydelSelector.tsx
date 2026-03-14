'use client'

import { Bydel } from '@/types/index'

interface BydelSelectorProps {
  bydeler: Bydel[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function BydelSelector({ bydeler, selected, onChange }: BydelSelectorProps) {
  const toggle = (slug: string) => {
    onChange(
      selected.includes(slug)
        ? selected.filter((s) => s !== slug)
        : [...selected, slug]
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {bydeler.map((bydel) => {
        const isSelected = selected.includes(bydel.slug)
        return (
          <button
            key={bydel.slug}
            type="button"
            onClick={() => toggle(bydel.slug)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            style={
              isSelected
                ? { backgroundColor: bydel.color, color: '#FFFFFF', border: `2px solid ${bydel.color}` }
                : { backgroundColor: '#FFFFFF', color: '#002D32', border: '2px solid #D4DCDE' }
            }
          >
            {bydel.emoji} {bydel.name}
          </button>
        )
      })}
    </div>
  )
}
