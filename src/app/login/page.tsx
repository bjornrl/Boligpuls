'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Ugyldig e-post eller passord.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto px-4 py-20">
          <h1
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
          >
            Admin-innlogging
          </h1>
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                  E-post
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
                  onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
                  Passord
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
                  onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
                />
              </div>
              {error && <p className="text-sm" style={{ color: '#D4593A' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#D4593A' }}
              >
                {loading ? 'Logger inn...' : 'Logg inn'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
