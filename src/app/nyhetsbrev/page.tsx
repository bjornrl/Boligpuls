import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsletterForm from '@/components/NewsletterForm'

export const metadata = { title: 'Nyhetsbrev — EIENDOM Trondheim' }

export default function NyhetsbrevPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="text-center mb-8">
            {/* <div className="text-5xl mb-4" style={{ color: '#D7B180' }}>&#128276;</div> */}
            <h1
              className="text-3xl mb-2"
              style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif', letterSpacing: '-0.02em' }}
            >
              EIENDOM Trondheim
            </h1>
            <p style={{ color: '#5F7A7D' }}>
              Vurderer du salg, men savner innsikt i prisnivået for boligen din? Drar du på visninger og ønsker bedre oversikt over markedet?
              <br /><br />
              Motta oppdateringer etter eget ønske. Kostnadsfritt og uforpliktende. Ønsker du å vite hva boligen din er verdt? <a href="/vurdering" style={{ color: '#155356', textDecoration: 'underline' }}>Les mer her.</a>
            </p>
          </div>
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <NewsletterForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
