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
          style={{ border: '1.5px solid #D4DCDE', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
          onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setBydelFilter(null)}
          className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={
            bydelFilter === null
              ? { backgroundColor: '#002D32', color: '#FFFFFF' }
              : { color: '#5F7A7D', border: '1px solid #D4DCDE' }
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

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#F8F7F5', borderBottom: '1px solid #E8ECEE' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Navn</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>E-post</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#9BAFB2' }}>Bydeler</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#9BAFB2' }}>Frekvens</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Status</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#9BAFB2' }}>Registrert</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id} style={{ borderBottom: '1px solid #E8ECEE' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F7F5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <td className="px-4 py-3 font-medium" style={{ color: '#002D32' }}>{sub.name}</td>
                <td className="px-4 py-3" style={{ color: '#5F7A7D' }}>{sub.email}</td>
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
                <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#5F7A7D' }}>
                  {sub.frequency === 'weekly' ? 'Ukentlig' : 'Månedlig'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={
                      sub.confirmed
                        ? { backgroundColor: '#DEE5E7', color: '#155356' }
                        : { backgroundColor: '#F3E9DB', color: '#B8860B' }
                    }
                  >
                    {sub.confirmed ? 'Bekreftet' : 'Venter'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#9BAFB2' }}>
                  {formatDate(sub.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8" style={{ color: '#9BAFB2' }}>
            Ingen abonnenter funnet.
          </p>
        )}
      </div>
    </div>
  )
}
