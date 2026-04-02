'use client'

import { useState, useEffect } from 'react'
import { Bydel } from '@/types/database'

export default function SubscribeForm() {
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

  const toggleBydel = (id: string) => {
    setSelectedBydeler((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedBydeler.length === 0) {
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
      setMessage('Takk! Sjekk e-posten din for å bekrefte abonnementet.')
      setEmail('')
      setName('')
      setSelectedBydeler([])
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Noe gikk galt')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: '#002D32' }}>
          Navn
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-sm"
          style={{ border: '1.5px solid #D4DCDE', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
          onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
          placeholder="Ditt navn"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#002D32' }}>
          E-post *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg text-sm"
          style={{ border: '1.5px solid #D4DCDE', outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
          onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
          placeholder="din@epost.no"
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                frequency === f
                  ? 'btn-primary px-4 py-2 text-sm'
                  : 'border border-[#D4DCDE] bg-white text-[#5F7A7D] hover:border-[#9BAFB2] hover:bg-[#FAFAF9]'
              }`}
            >
              {f === 'weekly' ? 'Ukentlig' : 'Månedlig'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium mb-2" style={{ color: '#002D32' }}>Velg bydeler *</span>
        <div className="grid grid-cols-2 gap-2">
          {bydeler.map((bydel) => (
            <button
              key={bydel.id}
              type="button"
              onClick={() => toggleBydel(bydel.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !selectedBydeler.includes(bydel.id) ? 'hover:border-[#9BAFB2] hover:bg-[#FAFAF9]' : ''
              }`}
              style={
                selectedBydeler.includes(bydel.id)
                  ? { backgroundColor: bydel.color, color: '#FFFFFF', border: `2px solid ${bydel.color}` }
                  : { backgroundColor: '#FFFFFF', color: '#002D32', border: '2px solid #D4DCDE' }
              }
            >
              {bydel.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-accent w-full py-3 text-sm disabled:opacity-50"
      >
        {status === 'loading' ? 'Registrerer...' : 'Abonner'}
      </button>

      {message && (
        <p
          className="text-sm text-center"
          style={{ color: status === 'success' ? '#155356' : '#8B3A3A' }}
        >
          {message}
        </p>
      )}
    </form>
  )
}
