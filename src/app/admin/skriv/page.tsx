import Link from 'next/link'

export default function SkrivPage() {
  return (
    <div className="max-w-3xl">
      <h1
        className="text-3xl mb-6"
        style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
      >
        Skriv nytt innlegg
      </h1>

      <div
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
      >
        <div className="text-4xl mb-4">&#9997;</div>
        <h2 className="text-xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
          Innlegg opprettes i Sanity Studio
        </h2>
        <p className="mb-6" style={{ color: '#5F7A7D' }}>
          Alt innhold redigeres nå gjennom Sanity Studio, som gir deg en bedre redigeringsopplevelse med forhåndsvisning og versjonshåndtering.
        </p>
        <Link
          href="/studio/structure/post"
          className="inline-block px-6 py-3 rounded-xl text-sm font-medium transition-colors"
          style={{ backgroundColor: '#D7B180', color: '#002D32' }}
        >
          Åpne Sanity Studio
        </Link>
      </div>
    </div>
  )
}
