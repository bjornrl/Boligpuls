import ValuationForm from '@/components/ValuationForm'

export const metadata = {
  title: 'Boligvurdering — Boligpuls Trondheim',
  description: 'Få en uforpliktende boligvurdering basert på lokalkunnskap og markedsdata.',
}

export default function VurderingPage() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: '#FAF9F6' }}
    >
      <div className="max-w-[560px] mx-auto px-4 py-16">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
          >
            Få en uforpliktende boligvurdering
          </h1>
          <p style={{ color: '#78716C', lineHeight: 1.6 }}>
            Lurer du på hva boligen din er verdt, eller vurderer du å selge? Vi gir deg en grundig vurdering basert på lokalkunnskap og markedsdata.
          </p>
        </div>

        <ValuationForm />
      </div>
    </main>
  )
}
