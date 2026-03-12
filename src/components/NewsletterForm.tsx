'use client'

import { useState, useEffect } from 'react'
import { Bydel } from '@/types/index'
import BydelSelector from './BydelSelector'

export default function NewsletterForm() {
  const [bydeler, setBydeler] = useState<Bydel[]>([])
  const [selectedBydeler, setSelectedBydeler] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/bydeler')
      .then((res) => res.json())
      .then((data) => setBydeler(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedBydeler.length === 0) {
      setMessage('Velg minst én bydel.')
      setStatus('error')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, frequency, bydeler: selectedBydeler }),
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
        <h3 className="text-xl font-bold mb-2" style={{ color: '#1C1917' }}>
          Sjekk innboksen din!
        </h3>
        <p style={{ color: '#78716C' }}>
          Vi har sendt deg en e-post med en bekreftelseslenke. Klikk på lenken for å aktivere abonnementet ditt.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
          Navn *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ditt navn"
          className="w-full px-4 py-2.5 rounded-xl text-sm transition-colors"
          style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
          onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
          E-post *
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.no"
          className="w-full px-4 py-2.5 rounded-xl text-sm transition-colors"
          style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
          onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
        />
      </div>

      <div>
        <span className="block text-sm font-medium mb-2" style={{ color: '#1C1917' }}>Frekvens</span>
        <div className="flex gap-4">
          {(['weekly', 'monthly'] as const).map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                value={f}
                checked={frequency === f}
                onChange={() => setFrequency(f)}
                style={{ accentColor: '#D4593A' }}
              />
              <span className="text-sm" style={{ color: '#1C1917' }}>
                {f === 'weekly' ? 'Ukentlig' : 'Månedlig'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium mb-2" style={{ color: '#1C1917' }}>
          Velg bydeler *
        </span>
        <BydelSelector
          bydeler={bydeler}
          selected={selectedBydeler}
          onChange={setSelectedBydeler}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
        style={{ backgroundColor: '#D4593A' }}
      >
        {status === 'loading' ? 'Registrerer...' : 'Abonner gratis'}
      </button>

      {message && status === 'error' && (
        <p className="text-sm text-center" style={{ color: '#D4593A' }}>
          {message}
        </p>
      )}
    </form>
  )
}
