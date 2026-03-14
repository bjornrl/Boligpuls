import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4" style={{ color: '#D4DCDE' }}>404</h1>
      <h2 className="text-2xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
        Siden ble ikke funnet
      </h2>
      <p className="mb-6" style={{ color: '#5F7A7D' }}>
        Beklager, vi kunne ikke finne siden du leter etter.
      </p>
      <Link href="/" className="font-medium" style={{ color: '#155356' }}>
        Tilbake til forsiden &rarr;
      </Link>
    </div>
  )
}
