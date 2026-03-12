import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Boligpuls Trondheim</h3>
            <p className="text-sm">
              Din kilde til oppdateringer om boligmarkedet i Trondheim,
              segmentert etter bydel.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Lenker</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/bydeler" className="hover:text-white">Bydeler</Link></li>
              <li><Link href="/artikler" className="hover:text-white">Artikler</Link></li>
              <li><Link href="/abonner" className="hover:text-white">Abonner</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Om oss</h4>
            <p className="text-sm">
              Boligpuls leverer ukentlige og månedlige nyhetsbrev om boligmarkedet
              i Trondheims bydeler.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          &copy; {new Date().getFullYear()} Boligpuls Trondheim. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  )
}
