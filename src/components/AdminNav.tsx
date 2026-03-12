'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const tabs = [
  { label: 'Oversikt', href: '/admin' },
  { label: 'Innlegg', href: '/admin/innlegg' },
  { label: 'Skriv nytt', href: '/admin/skriv' },
  { label: 'Abonnenter', href: '/admin/abonnenter' },
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
        backgroundColor: 'rgba(250,249,246,0.82)',
        backdropFilter: 'blur(20px)',
        borderColor: '#EDEBE8',
      }}
    >
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/admin" className="font-bold text-lg" style={{ color: '#1C1917' }}>
            Boligpuls Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: '#78716C' }}>{email}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: '#D4593A' }}
            >
              Logg ut
            </button>
          </div>
        </div>
        <div
          className="flex gap-1 -mb-px rounded-lg p-1"
          style={{ backgroundColor: '#F5F3EF' }}
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
                        color: '#1C1917',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      }
                    : { color: '#78716C' }
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
