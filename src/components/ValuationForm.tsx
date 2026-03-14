'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bydel } from '@/types/index'

type RequestType = 'verdivurdering' | 'salgstilbud'

export default function ValuationForm() {
  const router = useRouter()
  const [bydeler, setBydeler] = useState<Bydel[]>([])
  const [requestType, setRequestType] = useState<RequestType>('verdivurdering')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [selectedBydel, setSelectedBydel] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/bydeler')
      .then((res) => res.json())
      .then((data) => setBydeler(data))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Find bydel slug from id
    const bydelSlug = bydeler.find((b) => b.id === selectedBydel)?.slug || undefined

    try {
      const res = await fetch('/api/valuation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          address,
          bydel: bydelSlug,
          requestType,
          message: message || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Noe gikk galt. Prøv igjen.')
        return
      }

      setIsSuccess(true)
    } catch {
      setError('Noe gikk galt. Prøv igjen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}
      >
        <div
          className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ backgroundColor: '#F0FDF4' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
        >
          Takk for henvendelsen
        </h2>
        <p className="mb-6" style={{ color: '#78716C' }}>
          Vi tar kontakt innen 1–2 virkedager.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ backgroundColor: '#F5F3EF', color: '#1C1917' }}
        >
          Tilbake til oppdateringer
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}
      >
        {/* Type selector */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {([
            { type: 'verdivurdering' as RequestType, label: 'Jeg ønsker verdivurdering' },
            { type: 'salgstilbud' as RequestType, label: 'Jeg ønsker tilbud på salg' },
          ]).map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setRequestType(type)}
              className="p-4 rounded-xl text-sm font-medium transition-all text-left"
              style={
                requestType === type
                  ? {
                      backgroundColor: '#F5F3EF',
                      border: '2px solid #1C1917',
                      color: '#1C1917',
                    }
                  : {
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #E7E5E4',
                      color: '#78716C',
                    }
              }
            >
              <span className="flex items-center gap-2">
                {requestType === type && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
              Navn
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
              placeholder="Ditt fulle navn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
              E-post
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
              placeholder="din@epost.no"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
              Telefon <span style={{ color: '#A8A29E', fontWeight: 400 }}>(valgfri)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
              placeholder="Mobilnummer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
              Adresse
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
              placeholder="Gateadresse og husnummer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
              Bydel <span style={{ color: '#A8A29E', fontWeight: 400 }}>(valgfri)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {bydeler.map((bydel) => {
                const isSelected = selectedBydel === bydel.id
                return (
                  <button
                    key={bydel.id}
                    type="button"
                    onClick={() => setSelectedBydel(isSelected ? '' : bydel.id)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
              Melding <span style={{ color: '#A8A29E', fontWeight: 400 }}>(valgfri)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors resize-none"
              style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
              placeholder="Noe mer du vil fortelle oss?"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm" style={{ color: '#D4593A' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3.5 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: isSubmitting ? '#E7E5E4' : '#1C1917',
            color: '#FFFFFF',
          }}
        >
          {isSubmitting ? 'Sender...' : 'Send forespørsel'}
        </button>

        <p className="mt-4 text-xs text-center" style={{ color: '#A8A29E' }}>
          Dine opplysninger behandles konfidensielt og brukes kun til å besvare din henvendelse.
        </p>
      </div>
    </form>
  )
}
