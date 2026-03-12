import { createServerSupabaseClient } from '@/lib/supabase/server'
import SubscriberTable from '@/components/SubscriberTable'
import { SubscriberWithBydeler, Bydel } from '@/types/index'

export const metadata = { title: 'Abonnenter — Admin' }

export default async function AdminAbonnenterPage() {
  const supabase = createServerSupabaseClient()

  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*, subscriber_bydeler(bydel_id, bydeler(*))')
    .order('created_at', { ascending: false })

  const { data: bydeler } = await supabase
    .from('bydeler')
    .select('*')
    .order('name')

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
      >
        Abonnenter
      </h1>
      <SubscriberTable
        subscribers={(subscribers || []) as unknown as SubscriberWithBydeler[]}
        bydeler={(bydeler || []) as Bydel[]}
      />
    </div>
  )
}
