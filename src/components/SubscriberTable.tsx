'use client'

import { useState } from 'react'
import { SubscriberWithBydeler, Bydel } from '@/types/index'
import { formatDate } from '@/lib/utils'
import BydelPill from './BydelPill'

interface SubscriberTableProps {
  subscribers: SubscriberWithBydeler[]
  bydeler: Bydel[]
}

export default function SubscriberTable({ subscribers, bydeler }: SubscriberTableProps) {
  const [search, setSearch] = useState('')
  const [bydelFilter, setBydelFilter] = useState<string | null>(null)

  const filtered = subscribers.filter((sub) => {
    const matchesSearch =
      !search ||
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.email.toLowerCase().includes(search.toLowerCase())

    const matchesBydel =
      !bydelFilter ||
      sub.subscriber_bydeler.some((sb) => sb.bydel_id === bydelFilter)

    return matchesSearch && matchesBydel
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Søk etter navn eller e-post..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm"
          style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
          onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setBydelFilter(null)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={
            bydelFilter === null
              ? { backgroundColor: '#1C1917', color: '#FFFFFF' }
              : { color: '#78716C', border: '1px solid #EDEBE8' }
          }
        >
          Alle
        </button>
        {bydeler.map((b) => (
          <button
            key={b.id}
            onClick={() => setBydelFilter(bydelFilter === b.id ? null : b.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={
              bydelFilter === b.id
                ? { backgroundColor: b.color, color: '#FFFFFF' }
                : { backgroundColor: `${b.color}12`, color: b.color, border: `1px solid ${b.color}20` }
            }
          >
            {b.emoji} {b.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#FAF9F6', borderBottom: '1px solid #EDEBE8' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#78716C' }}>Navn</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#78716C' }}>E-post</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#78716C' }}>Bydeler</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#78716C' }}>Frekvens</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#78716C' }}>Status</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#78716C' }}>Registrert</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #F5F3EF' }}>
                <td className="px-4 py-3 font-medium" style={{ color: '#1C1917' }}>{sub.name}</td>
                <td className="px-4 py-3" style={{ color: '#78716C' }}>{sub.email}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {sub.subscriber_bydeler.map((sb, i) => (
                      <BydelPill
                        key={i}
                        name={sb.bydeler.name}
                        emoji={sb.bydeler.emoji}
                        color={sb.bydeler.color}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#78716C' }}>
                  {sub.frequency === 'weekly' ? 'Ukentlig' : 'Månedlig'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium"
                    style={{ color: sub.confirmed ? '#166534' : '#C4942E' }}
                  >
                    {sub.confirmed ? 'Bekreftet' : 'Venter'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#A8A29E' }}>
                  {formatDate(sub.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8" style={{ color: '#A8A29E' }}>
            Ingen abonnenter funnet.
          </p>
        )}
      </div>
    </div>
  )
}
