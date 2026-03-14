import { createServerSupabaseClient } from '@/lib/supabase/server'
import ValuationRequestsTable from '@/components/ValuationRequestsTable'
import { ValuationRequestWithBydel } from '@/types/index'

export const metadata = { title: 'Forespørsler — Admin' }

export default async function AdminForesporserPage() {
  const supabase = createServerSupabaseClient()

  const { data: requests } = await supabase
    .from('valuation_requests')
    .select('*, bydeler(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
      >
        Forespørsler
      </h1>
      <ValuationRequestsTable
        requests={(requests || []) as unknown as ValuationRequestWithBydel[]}
      />
    </div>
  )
}
