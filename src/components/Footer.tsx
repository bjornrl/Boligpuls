import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#002D32' }} className="mt-auto">
      <div className="max-w-[1120px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg mb-3" style={{ fontFamily: '"Basel Classic", Georgia, serif' }}>
              Boligpuls Trondheim
            </h3>
            <p className="text-sm" style={{ color: '#9BAFB2' }}>
              Din kilde til oppdateringer om boligmarkedet i Trondheim,
              segmentert etter bydel.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3" style={{ fontFamily: '"Basel Grotesk", system-ui, sans-serif' }}>Lenker</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#9BAFB2' }}>
              <li><Link href="/nyhetsbrev" className="hover:text-white transition-colors">Nyhetsbrev</Link></li>
              <li><Link href="/vurdering" className="hover:text-white transition-colors">Vurdering</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3" style={{ fontFamily: '"Basel Grotesk", system-ui, sans-serif' }}>Om oss</h4>
            <p className="text-sm" style={{ color: '#9BAFB2' }}>
              Boligpuls leverer nyhetsbrev om boligmarkedet
              i Trondheims bydeler.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: '#5F7A7D' }}>
          &copy; {new Date().getFullYear()} Boligpuls Trondheim. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  )
}
