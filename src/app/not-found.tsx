import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Siden ble ikke funnet</h2>
      <p className="text-gray-600 mb-6">
        Beklager, vi kunne ikke finne siden du leter etter.
      </p>
      <Link href="/" className="text-red-500 font-medium hover:text-red-600">
        Tilbake til forsiden &rarr;
      </Link>
    </div>
  )
}
