'use client'

import { useState } from 'react'
import { ValuationRequestWithBydel } from '@/types/index'

interface Props {
  requests: ValuationRequestWithBydel[]
}

const statusConfig = {
  ny: { label: 'Ny', color: '#C4942E', bg: '#FEF9C3' },
  kontaktet: { label: 'Kontaktet', color: '#3D6E99', bg: '#DBEAFE' },
  fullfort: { label: 'Fullført', color: '#166534', bg: '#DCFCE7' },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
}

export default function ValuationRequestsTable({ requests: initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const updateStatus = async (id: string, status: 'kontaktet' | 'fullfort') => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/valuation-request/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        )
      }
    } catch {
      // silently fail
    } finally {
      setUpdatingId(null)
    }
  }

  const counts = {
    ny: requests.filter((r) => r.status === 'ny').length,
    kontaktet: requests.filter((r) => r.status === 'kontaktet').length,
    fullfort: requests.filter((r) => r.status === 'fullfort').length,
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(Object.entries(counts) as [keyof typeof statusConfig, number][]).map(([key, count]) => (
          <div
            key={key}
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}
          >
            <p className="text-sm font-medium" style={{ color: '#78716C' }}>
              {statusConfig[key].label}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: statusConfig[key].color }}>
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      {requests.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}
        >
          <p style={{ color: '#78716C' }}>Ingen forespørsler ennå.</p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #EDEBE8' }}
        >
          <table className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #EDEBE8' }}>
                {['Navn', 'Type', 'Adresse', 'Bydel', 'Status', 'Dato', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium"
                    style={{ color: '#A8A29E' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const cfg = statusConfig[req.status]
                const isExpanded = expandedId === req.id
                return (
                  <>
                    <tr
                      key={req.id}
                      onClick={() => setExpandedId(isExpanded ? null : req.id)}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid #EDEBE8' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF9F6')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1C1917' }}>
                        {req.name}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#78716C' }}>
                        {req.request_type === 'verdivurdering' ? 'Verdivurdering' : 'Salgstilbud'}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#78716C' }}>
                        {req.address}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#78716C' }}>
                        {req.bydeler ? `${req.bydeler.emoji} ${req.bydeler.name}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#A8A29E' }}>
                        {formatDate(req.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {req.status !== 'kontaktet' && req.status !== 'fullfort' && (
                            <button
                              onClick={() => updateStatus(req.id, 'kontaktet')}
                              disabled={updatingId === req.id}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                              style={{ backgroundColor: '#DBEAFE', color: '#3D6E99' }}
                            >
                              Marker kontaktet
                            </button>
                          )}
                          {req.status !== 'fullfort' && (
                            <button
                              onClick={() => updateStatus(req.id, 'fullfort')}
                              disabled={updatingId === req.id}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                              style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
                            >
                              Marker fullført
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${req.id}-detail`} style={{ borderBottom: '1px solid #EDEBE8' }}>
                        <td colSpan={7} className="px-4 py-4" style={{ backgroundColor: '#FAF9F6' }}>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p style={{ color: '#A8A29E' }} className="text-xs mb-1">E-post</p>
                              <p style={{ color: '#1C1917' }}>{req.email}</p>
                            </div>
                            <div>
                              <p style={{ color: '#A8A29E' }} className="text-xs mb-1">Telefon</p>
                              <p style={{ color: '#1C1917' }}>{req.phone || '—'}</p>
                            </div>
                            {req.message && (
                              <div className="col-span-2">
                                <p style={{ color: '#A8A29E' }} className="text-xs mb-1">Melding</p>
                                <p style={{ color: '#1C1917' }}>{req.message}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
