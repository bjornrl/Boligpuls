import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LocalReportRequestForm from '@/components/LocalReportRequestForm'

export const metadata = {
  title: 'Be om lokalrapport — EIENDOM Trondheim',
  description: 'Ønsker du en markedsanalyse for et spesifikt område? Fyll inn skjemaet, så lager vi en rapport for deg.',
}

export default function LokalrapportForesporselPage() {
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
              Be om lokalrapport
            </h1>
            <p style={{ color: '#5F7A7D', lineHeight: 1.6 }}>
              Ønsker du en markedsanalyse for et spesifikt område? Fyll inn skjemaet, så lager vi en rapport for deg.
            </p>
          </div>

          <LocalReportRequestForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
