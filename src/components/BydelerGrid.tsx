import Link from 'next/link'
import { Bydel } from '@/types/database'

export default function BydelerGrid({ bydeler }: { bydeler: Bydel[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {bydeler.map((bydel) => (
        <Link
          key={bydel.id}
          href={`/bydeler/${bydel.slug}`}
          className="group rounded-xl p-6 text-white text-center hover:scale-105 transition-transform"
          style={{ backgroundColor: bydel.color }}
        >
          <h3 className="font-bold text-lg">{bydel.name}</h3>
          <span className="text-white/80 text-sm group-hover:text-white">
            Se artikler &rarr;
          </span>
        </Link>
      ))}
    </div>
  )
}
