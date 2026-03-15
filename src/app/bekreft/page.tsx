import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Bekreft abonnement — EIENDOM Trondheim' }

export default async function BekreftPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token
  let success = false

  if (token) {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('subscribers')
      .update({ confirmed: true })
      .eq('confirm_token', token)
      .eq('confirmed', false)

    success = !error
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      {success ? (
        <>
          <div className="text-5xl mb-4" style={{ color: '#155356' }}>&#10003;</div>
          <h1 className="text-2xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
            Abonnement bekreftet!
          </h1>
          <p className="mb-6" style={{ color: '#5F7A7D' }}>
            Du vil nå motta nyhetsbrev om boligmarkedet i dine valgte bydeler.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
            Ugyldig eller utløpt lenke
          </h1>
          <p className="mb-6" style={{ color: '#5F7A7D' }}>
            Bekreftelseslenken er ugyldig eller har allerede blitt brukt.
          </p>
        </>
      )}
      <Link href="/" className="font-medium" style={{ color: '#155356' }}>
        Tilbake til forsiden &rarr;
      </Link>
    </div>
  )
}
