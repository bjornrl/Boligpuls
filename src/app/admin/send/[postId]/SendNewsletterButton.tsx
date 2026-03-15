'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SendNewsletterButton({
  postId,
  subscriberCount,
}: {
  postId: string
  subscriberCount: number
}) {
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null)

  const handleSend = async () => {
    if (!confirm(`Vil du sende nyhetsbrevet til ${subscriberCount} abonnenter?`)) return
    setSending(true)

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        alert(data.error || 'Noe gikk galt')
      }
    } catch {
      alert('Kunne ikke sende nyhetsbrevet')
    } finally {
      setSending(false)
    }
  }

  if (result) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
      >
        <div className="text-5xl mb-4">&#9993;</div>
        <h2 className="text-xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
          Nyhetsbrev sendt!
        </h2>
        <p style={{ color: '#5F7A7D' }}>
          <span style={{ color: '#155356', fontWeight: 600 }}>{result.sent}</span> sendt
          {result.failed > 0 && (
            <>, <span style={{ color: '#8B3A3A', fontWeight: 600 }}>{result.failed}</span> feilet</>
          )}
          {' '}av {result.total} totalt.
        </p>
        <Link
          href="/admin/innlegg"
          className="inline-block mt-6 text-sm font-medium"
          style={{ color: '#155356' }}
        >
          &larr; Tilbake til innlegg
        </Link>
      </div>
    )
  }

  return (
    <button
      onClick={handleSend}
      disabled={sending || subscriberCount === 0}
      className="w-full py-3 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
      style={{ backgroundColor: '#002D32' }}
    >
      {sending
        ? 'Sender...'
        : `Send til ${subscriberCount} abonnenter`}
    </button>
  )
}
