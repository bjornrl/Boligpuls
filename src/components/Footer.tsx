import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1C1917' }} className="mt-auto">
      <div className="max-w-[1120px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>
              Boligpuls Trondheim
            </h3>
            <p className="text-sm" style={{ color: '#A8A29E' }}>
              Din kilde til oppdateringer om boligmarkedet i Trondheim,
              segmentert etter bydel.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Lenker</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#A8A29E' }}>
              <li><Link href="/nyhetsbrev" className="hover:text-white transition-colors">Nyhetsbrev</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'var(--font-outfit)' }}>Om oss</h4>
            <p className="text-sm" style={{ color: '#A8A29E' }}>
              Boligpuls leverer nyhetsbrev om boligmarkedet
              i Trondheims bydeler.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid #333', color: '#78716C' }}>
          &copy; {new Date().getFullYear()} Boligpuls Trondheim. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  )
}
