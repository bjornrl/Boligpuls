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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Navn
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Ditt navn"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-post *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="din@epost.no"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Frekvens</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="frequency"
              value="weekly"
              checked={frequency === 'weekly'}
              onChange={() => setFrequency('weekly')}
              className="text-red-500 focus:ring-red-500"
            />
            <span className="text-sm">Ukentlig</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="frequency"
              value="monthly"
              checked={frequency === 'monthly'}
              onChange={() => setFrequency('monthly')}
              className="text-red-500 focus:ring-red-500"
            />
            <span className="text-sm">Månedlig</span>
          </label>
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-gray-700 mb-2">Velg bydeler *</span>
        <div className="grid grid-cols-2 gap-2">
          {bydeler.map((bydel) => (
            <button
              key={bydel.id}
              type="button"
              onClick={() => toggleBydel(bydel.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                selectedBydeler.includes(bydel.id)
                  ? 'text-white border-transparent'
                  : 'text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
              style={
                selectedBydeler.includes(bydel.id)
                  ? { backgroundColor: bydel.color, borderColor: bydel.color }
                  : undefined
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
        className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? 'Registrerer...' : 'Abonner gratis'}
      </button>

      {message && (
        <p
          className={`text-sm text-center ${
            status === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
