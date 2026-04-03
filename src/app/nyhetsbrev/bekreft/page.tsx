import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Bekreft abonnement — Eiendom Trondheim' }

export default function BekreftPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const success = searchParams.status === 'success'

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          {success ? (
            <>
              <div className="text-5xl mb-4" style={{ color: '#155356' }}>&#10003;</div>
              <h1
                className="text-2xl mb-2"
                style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
              >
                Velkommen til EIENDOM Trondheim!
              </h1>
              <p className="mb-6" style={{ color: '#5F7A7D' }}>
                Du vil motta månedlige oppdateringer om boligmarkedet i Trondheim              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">&#9888;</div>
              <h1
                className="text-2xl mb-2"
                style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
              >
                Ugyldig eller utløpt lenke
              </h1>
              <p className="mb-6" style={{ color: '#5F7A7D' }}>
                Bekreftelseslenken er ugyldig eller har allerede blitt brukt.
              </p>
            </>
          )}
          <Link
            href="/"
            className="inline-block text-sm font-medium transition-colors"
            style={{ color: '#155356' }}
          >
            Tilbake til forsiden &rarr;
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
