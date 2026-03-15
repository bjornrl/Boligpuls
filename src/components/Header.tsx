'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#002D32' }}
    >
      <div className="max-w-[1120px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ backgroundColor: '#D7B180' }}
          >
            <span className="text-white text-xs font-bold">ET</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg text-white" style={{ fontFamily: '"Basel Classic", Georgia, serif' }}>
              Eiendom Trondheim
            </span>
            <span
              className="text-[11px] uppercase tracking-wider"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"Basel Grotesk", system-ui, sans-serif', fontWeight: 500 }}
            >
              Trondheim
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/nyhetsbrev"
            className="text-sm transition-opacity"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            Nyhetsbrev
          </Link>
          <Link
            href="/vurdering"
            className="text-sm flex items-center gap-1.5 transition-opacity"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Verdivurdering/På flyttefot
          </Link>
          <Link
            href="/om"
            className="text-sm transition-opacity"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,1)')}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            Om meg
          </Link>
          <Link
            href="/nyhetsbrev"
            className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: '#D7B180', color: '#002D32' }}
          >
            Abonner
          </Link>
        </nav>
      </div>
    </header>
  )
}
