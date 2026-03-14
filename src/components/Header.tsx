import Link from 'next/link'

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(250,249,246,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: '#EDEBE8',
      }}
    >
      <div className="max-w-[1120px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4593A, #C4942E)' }}
          >
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <span className="text-lg font-bold" style={{ color: '#1C1917', fontFamily: 'var(--font-outfit)' }}>
            Boligpuls Trondheim
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/nyhetsbrev"
            className="text-sm font-medium transition-colors"
            style={{ color: '#78716C' }}
          >
            Nyhetsbrev
          </Link>
          <Link
            href="/vurdering"
            className="text-sm font-medium transition-colors flex items-center gap-1.5"
            style={{ color: '#78716C' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Vurdering
          </Link>
          <Link
            href="/nyhetsbrev"
            className="text-sm font-medium px-4 py-2 rounded-xl transition-colors text-white"
            style={{ backgroundColor: '#D4593A' }}
          >
            Abonner
          </Link>
        </nav>
      </div>
    </header>
  )
}
