'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: '#002D32' }}
    >
      <div className="max-w-[1120px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg text-white" style={{ fontFamily: '"Basel Classic", Georgia, serif' }}>
              Eiendom Trondheim
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/vurdering"
            className="text-sm flex items-center gap-1.5 hover:text-white transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Verdivurdering/På flyttefot
          </Link>
          <Link
            href="/om"
            className="text-sm hover:text-white transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Om
          </Link>
          <Link
            href="/nyhetsbrev"
            className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            style={{ backgroundColor: '#D7B180', color: '#002D32' }}
          >
            Abonner
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meny"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 pb-4 pt-2 space-y-1"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <Link
            href="/vurdering"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Verdivurdering/På flyttefot
          </Link>
          <Link
            href="/om"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-3 rounded-xl text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Om
          </Link>
          <Link
            href="/nyhetsbrev"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-3 rounded-xl text-sm font-medium text-center mt-2 transition-colors"
            style={{ backgroundColor: '#D7B180', color: '#002D32' }}
          >
            Abonner
          </Link>
        </div>
      )}
    </header>
  )
}
