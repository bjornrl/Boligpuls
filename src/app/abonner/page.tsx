import SubscribeForm from '@/components/SubscribeForm'

export const metadata = { title: 'Abonner — Boligpuls Trondheim' }

export default function AbonnerPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Abonner på Boligpuls</h1>
      <p className="text-gray-600 mb-8">
        Velg de bydelene du er interessert i, og få oppdateringer om boligmarkedet
        rett i innboksen.
      </p>
      <SubscribeForm />
    </div>
  )
}
