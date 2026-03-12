import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Avmeldt — Boligpuls Trondheim' }

export default function AvmeldtPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">&#128075;</div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
          >
            Du er avmeldt
          </h1>
          <p className="mb-6" style={{ color: '#78716C' }}>
            Du vil ikke lenger motta nyhetsbrev fra Boligpuls Trondheim. Vi håper å se deg igjen!
          </p>
          <Link
            href="/"
            className="inline-block text-sm font-medium transition-colors"
            style={{ color: '#D4593A' }}
          >
            Tilbake til forsiden &rarr;
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
