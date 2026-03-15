'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const tabs = [
  { label: 'Oversikt', href: '/admin' },
  { label: 'Innlegg', href: '/admin/innlegg' },
  { label: 'Studio', href: '/studio' },
  { label: 'Abonnenter', href: '/admin/abonnenter' },
  { label: 'Forespørsler', href: '/admin/foresporser' },
]

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(248,247,245,0.82)',
        backdropFilter: 'blur(20px)',
        borderColor: '#E8ECEE',
      }}
    >
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/admin" className="font-bold text-lg" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
            EIENDOM Trondheim Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: '#5F7A7D' }}>{email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#8B3A3A' }}
            >
              Logg ut
            </button>
          </div>
        </div>
        <div
          className="flex gap-1 -mb-px rounded-lg p-1"
          style={{ backgroundColor: '#DEE5E7' }}
        >
          {tabs.map((tab) => {
            const isActive =
              tab.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(tab.href)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all"
                style={
                  isActive
                    ? {
                      backgroundColor: '#FFFFFF',
                      color: '#002D32',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }
                    : { color: '#5F7A7D' }
                }
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
