import SubscribeForm from '@/components/SubscribeForm'

export const metadata = { title: 'Abonner — Eiendom Trondheim' }

export default function AbonnerPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
        Abonner på EIENDOM Trondheim
      </h1>
      <p className="mb-8" style={{ color: '#5F7A7D' }}>
        Velg de bydelene du er interessert i, og få oppdateringer om boligmarkedet
        rett i innboksen.
      </p>
      <SubscribeForm />
    </div>
  )
}
