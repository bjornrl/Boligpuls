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
          <div className="text-center mb-6">
            <div className="text-4xl mb-3" style={{ color: '#5F7A7D' }}>&#128274;</div>
            <h1
              className="text-2xl mb-2"
              style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
            >
              Admin-innlogging
            </h1>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
                  E-post
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ border: '1.5px solid #D4DCDE', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#002D32' }}>
                  Passord
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm"
                  style={{ border: '1.5px solid #D4DCDE', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
                  onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
                />
              </div>
              {error && (
                <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: '#F3E2DE', color: '#8B3A3A' }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#002D32' }}
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
