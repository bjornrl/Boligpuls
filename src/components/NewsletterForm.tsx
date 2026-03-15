'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, frequency }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Noe gikk galt')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Noe gikk galt')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">&#9993;</div>
        <h3 className="text-xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
          Sjekk innboksen din!
        </h3>
        <p style={{ color: '#5F7A7D' }}>
          Vi har sendt deg en e-post med en bekreftelseslenke. Klikk på lenken for å aktivere abonnementet ditt.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
          Navn *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ditt navn"
          className="w-full px-4 py-2.5 rounded-xl text-sm transition-colors"
          style={{ border: '1.5px solid #D4DCDE', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
          onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
          E-post *
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.no"
          className="w-full px-4 py-2.5 rounded-xl text-sm transition-colors"
          style={{ border: '1.5px solid #D4DCDE', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
          onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
        />
      </div>

      <div>
        <span className="block text-sm font-medium mb-2" style={{ color: '#002D32' }}>Frekvens</span>
        <div className="flex gap-3">
          {(['weekly', 'monthly'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                frequency === f
                  ? { backgroundColor: '#002D32', color: '#FFFFFF' }
                  : { backgroundColor: '#FFFFFF', color: '#5F7A7D', border: '1.5px solid #D4DCDE' }
              }
            >
              {f === 'weekly' ? 'Ukentlig' : 'Månedlig'}
            </button>
          ))}
        </div>
        <p className="text-xs mt-2" style={{ color: '#9BAFB2' }}>
          {frequency === 'weekly'
            ? 'Korte ukentlige oppdateringer + alle månedlige og kvartalsvise rapporter'
            : 'Månedlige rapporter + kvartalsvise og årlige rapporter'}
        </p>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
        style={{ backgroundColor: '#D7B180', color: '#002D32' }}
      >
        {status === 'loading' ? 'Registrerer...' : 'Abonner gratis'}
      </button>

      {message && status === 'error' && (
        <p className="text-sm text-center" style={{ color: '#8B3A3A' }}>
          {message}
        </p>
      )}
    </form>
  )
}
