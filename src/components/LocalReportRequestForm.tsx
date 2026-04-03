'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LocalReportRequestForm() {
  const router = useRouter()
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
      const res = await fetch('/api/local-report-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone.trim() || undefined,
          address,
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
          Takk for henvendelsen!
        </h2>
        <p className="mb-6" style={{ color: '#5F7A7D' }}>
          Vi lager en rapport for ditt område og tar kontakt når den er klar.
        </p>
        <button
          type="button"
          onClick={() => router.push('/?tab=local')}
          className="btn-secondary px-6 py-3 text-sm"
        >
          Tilbake til Lokalmarkedet
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
              Adresse eller område du ønsker rapport for
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
              style={{ border: '1px solid #D4DCDE', color: '#002D32' }}
              placeholder="F.eks. Ilavegen 21-35 eller Bakklandet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
              Noe spesielt du lurer på? <span style={{ color: '#9BAFB2', fontWeight: 400 }}>(valgfri)</span>
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
          className="w-full mt-6 py-3.5 text-sm text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: '#002D32' }}
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
