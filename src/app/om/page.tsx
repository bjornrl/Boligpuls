import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Om meg — Eiendom Trondheim',
  description: 'Lær mer om personen bak Eiendom Trondheim og hvordan du kan ta kontakt.',
}

export default function OmPage() {
  return (
    <>
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#F8F7F5' }}>
        <div className="max-w-[680px] mx-auto px-4 py-16">
          <h1
            className="text-3xl mb-8"
            style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif', letterSpacing: '-0.02em' }}
          >
            Om meg
          </h1>

          <div
            className="rounded-2xl p-8 md:p-10 mb-8"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image
                  src="/fonts/profile-photo.jpg"
                  alt="Martin Brandvik"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2
                  className="text-3xl mb-1"
                  style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
                >
                  Martin Brandvik
                </h2>
                {/* <p className="text-sm" style={{ color: '#5F7A7D' }}>
                  Eiendomsmegler — Nordvik Bolig, Trondheim
                </p> */}
              </div>
            </div>

            <div className="space-y-4" style={{ color: '#155356', lineHeight: 1.75 }}>
              <p>
                Hei! Jeg heter Martin Brandvik, og jobber hos Nordvik Bolig i Trondheim.
                <p>
                  EIENDOM Trondheim startet som jevnlige oppdateringer av boligmarkedet over epost. Jeg tenkte det var greit å dele med alle som er interesserte.

                </p>
                <p>
                  Kanskje du skal selge snart og lurer på hva boligen din faktisk er verdt. Kanskje du bare syns boligmarkedet er interessant å følge med på. Uansett håper jeg dette nyhetsbrevet gjør det litt enklere for deg å være oppdatert.              </p>

              </p>
            </div>
          </div>

          {/* Contact info */}
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <h2
              className="text-xl mb-6"
              style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
            >
              Ta kontakt
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#DEE5E7' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#9BAFB2' }}>E-post</p>
                  <a href="mailto:m.brandvik@nordvikbolig.no" className="text-sm font-medium" style={{ color: '#002D32' }}>
                    m.brandvik@nordvikbolig.no
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#DEE5E7' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#9BAFB2' }}>Telefon</p>
                  <a href="tel:+4746422304" className="text-sm font-medium" style={{ color: '#002D32' }}>
                    +47 464 22 304
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#DEE5E7' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155356" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#9BAFB2' }}>Kontor</p>
                  <p className="text-sm font-medium" style={{ color: '#002D32' }}>
                    Nordvik Bolig, Trondheim
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: '1px solid #E8ECEE' }}>
              <p className="text-sm mb-4" style={{ color: '#5F7A7D' }}>
                Trenger du hjelp med kjøp eller salg av bolig? Jeg hjelper deg gjerne.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/vurdering"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#002D32', color: '#FFFFFF' }}
                >
                  Be om verdivurdering
                </Link>
                <Link
                  href="/nyhetsbrev"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#DEE5E7', color: '#002D32' }}
                >
                  Abonner på nyhetsbrev
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
