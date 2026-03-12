import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Bekreft abonnement — Boligpuls Trondheim' }

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
          <div className="text-5xl mb-4">&#10003;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Abonnement bekreftet!
          </h1>
          <p className="text-gray-600 mb-6">
            Du vil nå motta nyhetsbrev om boligmarkedet i dine valgte bydeler.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ugyldig eller utløpt lenke
          </h1>
          <p className="text-gray-600 mb-6">
            Bekreftelseslenken er ugyldig eller har allerede blitt brukt.
          </p>
        </>
      )}
      <Link href="/" className="text-red-500 font-medium hover:text-red-600">
        Tilbake til forsiden &rarr;
      </Link>
    </div>
  )
}
