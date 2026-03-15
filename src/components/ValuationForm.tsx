'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type RequestType = 'verdivurdering' | 'salgstilbud'

export default function ValuationForm() {
  const router = useRouter()
  const [requestType, setRequestType] = useState<RequestType>('verdivurdering')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/valuation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          address,
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
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
      >
        <div
          className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ backgroundColor: '#DEE5E7' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#155356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2
          className="text-2xl mb-2"
          style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
        >
          Takk for henvendelsen
        </h2>
        <p className="mb-6" style={{ color: '#5F7A7D' }}>
          Du hører fra meg snart!
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ backgroundColor: '#DEE5E7', color: '#002D32' }}
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
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
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
                    backgroundColor: '#DEE5E7',
                    border: '2px solid #002D32',
                    color: '#002D32',
                  }
                  : {
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #D4DCDE',
                    color: '#5F7A7D',
                  }
              }
            >
              <span className="flex items-center gap-2">
                {requestType === type && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#002D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
              Navn
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #D4DCDE', color: '#002D32' }}
              placeholder="Ditt fulle navn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
              E-post
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #D4DCDE', color: '#002D32' }}
              placeholder="din@epost.no"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
              Telefon <span style={{ color: '#9BAFB2', fontWeight: 400 }}>(valgfri)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #D4DCDE', color: '#002D32' }}
              placeholder="Mobilnummer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
              Adresse
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #D4DCDE', color: '#002D32' }}
              placeholder="Gateadresse og husnummer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
              Melding <span style={{ color: '#9BAFB2', fontWeight: 400 }}>(valgfri)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors resize-none"
              style={{ border: '1px solid #D4DCDE', color: '#002D32' }}
              placeholder="Noe mer du vil fortelle oss?"
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: '#F3E2DE', color: '#8B3A3A' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 py-3.5 rounded-xl text-sm font-medium transition-all text-white"
          style={{
            backgroundColor: isSubmitting ? '#D4DCDE' : '#002D32',
          }}
        >
          {isSubmitting ? 'Sender...' : 'Send forespørsel'}
        </button>

        <p className="mt-4 text-xs text-center" style={{ color: '#9BAFB2' }}>
          Dine opplysninger behandles konfidensielt og brukes kun til å besvare din henvendelse.
        </p>
      </div>
    </form>
  )
}
