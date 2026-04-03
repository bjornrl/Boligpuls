'use client'

import { useState } from 'react'
import type { LocalReportRequest } from '@/types/index'

interface Props {
  requests: LocalReportRequest[]
}

const statusConfig = {
  ny: { label: 'Ny', color: '#B8860B', bg: '#F3E9DB' },
  kontaktet: { label: 'Kontaktet', color: '#155356', bg: '#DEE5E7' },
  fullfort: { label: 'Fullført', color: '#FFFFFF', bg: '#155356' },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })
}

export default function LocalReportRequestsTable({ requests: initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const updateStatus = async (id: string, status: 'kontaktet' | 'fullfort') => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/local-report-request/${id}`, {
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
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <p className="text-sm font-medium" style={{ color: '#5F7A7D' }}>
              {statusConfig[key].label}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: statusConfig[key].color === '#FFFFFF' ? '#155356' : statusConfig[key].color }}>
              {count}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      {requests.length === 0 ? (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
        >
          <p style={{ color: '#5F7A7D' }}>Ingen forespørsler ennå.</p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #E8ECEE' }}
        >
          <table className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E8ECEE', backgroundColor: '#F8F7F5' }}>
                {['Navn', 'Område/Adresse', 'Status', 'Dato', ''].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium"
                    style={{ color: '#9BAFB2' }}
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
                      style={{ borderBottom: '1px solid #E8ECEE' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F7F5')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <td className="px-4 py-3 text-sm font-medium" style={{ color: '#002D32' }}>
                        {req.name}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#5F7A7D' }}>
                        {req.address}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#9BAFB2' }}>
                        {formatDate(req.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {req.status !== 'kontaktet' && req.status !== 'fullfort' && (
                            <button
                              onClick={() => updateStatus(req.id, 'kontaktet')}
                              disabled={updatingId === req.id}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                              style={{ backgroundColor: '#DEE5E7', color: '#155356' }}
                            >
                              Marker kontaktet
                            </button>
                          )}
                          {req.status !== 'fullfort' && (
                            <button
                              onClick={() => updateStatus(req.id, 'fullfort')}
                              disabled={updatingId === req.id}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors text-white"
                              style={{ backgroundColor: '#155356' }}
                            >
                              Marker fullført
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${req.id}-detail`} style={{ borderBottom: '1px solid #E8ECEE' }}>
                        <td colSpan={5} className="px-4 py-4" style={{ backgroundColor: '#F8F7F5' }}>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p style={{ color: '#9BAFB2' }} className="text-xs mb-1">E-post</p>
                              <p style={{ color: '#002D32' }}>{req.email}</p>
                            </div>
                            <div>
                              <p style={{ color: '#9BAFB2' }} className="text-xs mb-1">Telefon</p>
                              <p style={{ color: '#002D32' }}>{req.phone || '—'}</p>
                            </div>
                            {req.message && (
                              <div className="col-span-2">
                                <p style={{ color: '#9BAFB2' }} className="text-xs mb-1">Melding</p>
                                <p style={{ color: '#002D32' }}>{req.message}</p>
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
