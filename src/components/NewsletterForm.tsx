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

  // When switching to weekly, auto-select "trondheim" and clear individual bydeler
  useEffect(() => {
    if (frequency === 'weekly') {
      setSelectedBydeler(['trondheim'])
    } else {
      setSelectedBydeler([])
    }
  }, [frequency])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (frequency === 'monthly' && selectedBydeler.length === 0) {
      setMessage('Velg minst en bydel.')
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
        <h3 className="text-xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
          Sjekk innboksen din!
        </h3>
        <p style={{ color: '#5F7A7D' }}>
          Vi har sendt deg en e-post med en bekreftelseslenke. Klikk på lenken for å aktivere abonnementet ditt.
        </p>
      </div>
    )
  }

  // Filter out "trondheim" from bydel selector for monthly view
  const individualBydeler = bydeler.filter((b) => b.slug !== 'trondheim')

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
      </div>

      {frequency === 'weekly' ? (
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: '#DEE5E7', border: '1px solid #D4DCDE' }}
        >
          <p className="text-sm" style={{ color: '#155356' }}>
            Ukentlige oppdateringer dekker hele Trondheim kommune.
          </p>
        </div>
      ) : (
        <div>
          <span className="block text-sm font-medium mb-2" style={{ color: '#002D32' }}>
            Velg bydeler *
          </span>
          <BydelSelector
            bydeler={individualBydeler}
            selected={selectedBydeler}
            onChange={setSelectedBydeler}
          />
        </div>
      )}

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
