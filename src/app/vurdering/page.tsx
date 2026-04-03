import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ValuationForm from '@/components/ValuationForm'

export const metadata = {
  title: 'Boligvurdering — EIENDOM Trondheim',
  description: 'Få en uforpliktende boligvurdering basert på lokalkunnskap og markedsdata.',
}

export default function VurderingPage() {
  return (
    <>
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#F8F7F5' }}>
        <div className="max-w-[560px] mx-auto px-4 py-16">
          <div className="mb-8 text-center">
            <h1
              className="text-3xl mb-3"
              style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif', letterSpacing: '-0.02em' }}
            >
              Få en uforpliktende verdivurdering
            </h1>
            <p style={{ color: '#5F7A7D', lineHeight: 1.6 }}>
              Lurer du på hva boligen din er verdt? Mange tar kontakt rett og slett fordi de er nysgjerrige, det er helt greit. Vi kjenner byen vår godt, og vurderingene baseres på løpende markedsdata og lokal erfaring. Fyll inn skjemaet, så tar vi kontakt innen én virkedag. <br /> <br />Ønsker du jevnlige oppdateringer om boligmarkedet?{' '}
              <a href="/nyhetsbrev" style={{ color: '#155356', textDecoration: 'underline' }}>Les mer her.</a>
            </p>
          </div>

          <ValuationForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
