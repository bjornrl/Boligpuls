import { createServerSupabaseClient } from '@/lib/supabase/server'
import StatsCards from '@/components/StatsCards'
import BydelPill from '@/components/BydelPill'

export const metadata = { title: 'Admin — Boligpuls Trondheim' }

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  const [
    { count: publishedCount },
    { count: draftCount },
    { count: confirmedCount },
    { count: unconfirmedCount },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('posts').select('*', { count: 'exact', head: true }).eq('is_published', false),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true).eq('is_active', true),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', false),
  ])

  // Get subscriber counts per bydel
  const { data: bydeler } = await supabase.from('bydeler').select('*').order('name')
  const { data: subscriberBydeler } = await supabase
    .from('subscriber_bydeler')
    .select('bydel_id, subscribers!inner(confirmed)')
    .eq('subscribers.confirmed', true)

  const bydelCounts = new Map<string, number>()
  subscriberBydeler?.forEach((sb: { bydel_id: string }) => {
    bydelCounts.set(sb.bydel_id, (bydelCounts.get(sb.bydel_id) || 0) + 1)
  })

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
      >
        Dashboard
      </h1>

      <StatsCards
        stats={[
          { label: 'Publiserte', value: publishedCount || 0, color: '#166534' },
          { label: 'Utkast', value: draftCount || 0, color: '#C4942E' },
          { label: 'Bekreftede abonnenter', value: confirmedCount || 0 },
          { label: 'Ubekreftede', value: unconfirmedCount || 0, color: '#A8A29E' },
        ]}
      />

      <h2
        className="text-xl font-bold mt-10 mb-4"
        style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
      >
        Abonnenter per bydel
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bydeler?.map((bydel) => (
          <div
            key={bydel.id}
            className="rounded-2xl p-5"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}
          >
            <BydelPill name={bydel.name} emoji={bydel.emoji} color={bydel.color} size="md" />
            <p className="text-2xl font-bold mt-3" style={{ color: '#1C1917' }}>
              {bydelCounts.get(bydel.id) || 0}
            </p>
            <p className="text-xs" style={{ color: '#A8A29E' }}>bekreftede</p>
          </div>
        ))}
      </div>
    </div>
  )
}
