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
            ? { backgroundColor: '#002D32', color: '#FFFFFF' }
            : { backgroundColor: '#FFFFFF', color: '#9BAFB2', border: '1px solid #D4DCDE' }
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
              ? { backgroundColor: `${bydel.color}18`, color: bydel.color, border: `1px solid ${bydel.color}` }
              : {
                  backgroundColor: '#FFFFFF',
                  color: '#9BAFB2',
                  border: '1px solid #D4DCDE',
                }
          }
        >
          {bydel.emoji} {bydel.name}
        </button>
      ))}
    </div>
  )
}
