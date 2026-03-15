import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ValuationForm from '@/components/ValuationForm'

export const metadata = {
  title: 'Boligvurdering — Eiendom Trondheim',
  description: 'Få en uforpliktende boligvurdering basert på lokalkunnskap og markedsdata.',
}

export default function VurderingPage() {
  return (
    <>
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#F8F7F5' }}>
        <div className="max-w-[560px] mx-auto px-4 py-16">
          <div className="mb-8">
            <h1
              className="text-3xl mb-3"
              style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif', letterSpacing: '-0.02em' }}
            >
              Få en uforpliktende boligvurdering
            </h1>
            <p style={{ color: '#5F7A7D', lineHeight: 1.6 }}>
              Lurer du på hva boligen din er verdt, eller vurderer du å selge? Vi gir deg en grundig vurdering basert på lokalkunnskap og markedsdata.
            </p>
          </div>

          <ValuationForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
