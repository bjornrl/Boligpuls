import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-400 rounded-lg" />
          <span className="text-xl font-bold text-gray-900">Boligpuls Trondheim</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/bydeler" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Bydeler
          </Link>
          <Link href="/artikler" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Artikler
          </Link>
          <Link
            href="/abonner"
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Abonner
          </Link>
        </nav>
      </div>
    </header>
  )
}
