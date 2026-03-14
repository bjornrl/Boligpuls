import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sanityClient } from '@/sanity/client'
import { groq } from 'next-sanity'
import StatsCards from '@/components/StatsCards'
import BydelPill from '@/components/BydelPill'
import type { SanityBydel } from '@/sanity/types'

export const revalidate = 60

export const metadata = { title: 'Admin — Boligpuls Trondheim' }

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  // Fetch post count from Sanity
  const postCount = await sanityClient.fetch<number>(
    groq`count(*[_type == "post" && defined(publishedAt)])`
  )

  const [
    { count: confirmedCount },
    { count: unconfirmedCount },
    { count: newRequestsCount },
  ] = await Promise.all([
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true).eq('is_active', true),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', false),
    supabase.from('valuation_requests').select('*', { count: 'exact', head: true }).eq('status', 'ny'),
  ])

  // Get bydeler from Sanity + subscriber counts from Supabase
  const bydeler = await sanityClient.fetch<SanityBydel[]>(
    groq`*[_type == "bydel"] | order(name asc) { _id, name, "slug": slug.current, emoji, color }`
  )

  const { data: supabaseBydeler } = await supabase.from('bydeler').select('id, slug')
  const { data: subscriberBydeler } = await supabase
    .from('subscriber_bydeler')
    .select('bydel_id, subscribers!inner(confirmed)')
    .eq('subscribers.confirmed', true)

  const bydelCounts = new Map<string, number>()
  subscriberBydeler?.forEach((sb: { bydel_id: string }) => {
    bydelCounts.set(sb.bydel_id, (bydelCounts.get(sb.bydel_id) || 0) + 1)
  })

  // Map Supabase bydel slugs to IDs
  const slugToId = new Map<string, string>()
  supabaseBydeler?.forEach((b) => slugToId.set(b.slug, b.id))

  return (
    <div>
      <h1
        className="text-3xl mb-8"
        style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
      >
        Dashboard
      </h1>

      <StatsCards
        stats={[
          { label: 'Publiserte innlegg', value: postCount || 0, color: '#155356' },
          { label: 'Bekreftede abonnenter', value: confirmedCount || 0 },
          { label: 'Ubekreftede', value: unconfirmedCount || 0, color: '#9BAFB2' },
          { label: 'Nye forespørsler', value: newRequestsCount || 0, color: '#B8860B' },
        ]}
      />

      <h2
        className="text-xl mt-10 mb-4"
        style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
      >
        Abonnenter per bydel
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bydeler?.map((bydel) => {
          const supabaseId = slugToId.get(bydel.slug) || ''
          return (
            <div
              key={bydel._id}
              className="rounded-2xl p-5"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
            >
              <BydelPill name={bydel.name} emoji={bydel.emoji} color={bydel.color} size="md" />
              <p className="text-2xl font-bold mt-3" style={{ color: '#002D32' }}>
                {bydelCounts.get(supabaseId) || 0}
              </p>
              <p className="text-xs" style={{ color: '#9BAFB2' }}>bekreftede</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
