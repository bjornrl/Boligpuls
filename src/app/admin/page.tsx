import { createServerSupabaseClient } from '@/lib/supabase/server'
import { sanityClient } from '@/sanity/client'
import { groq } from 'next-sanity'
import StatsCards from '@/components/StatsCards'

export const revalidate = 60

export const metadata = { title: 'Admin — Eiendom Trondheim' }

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()

  const [postCount, localReportCount] = await Promise.all([
    sanityClient.fetch<number>(groq`count(*[_type == "post" && defined(publishedAt)])`),
    sanityClient.fetch<number>(groq`count(*[_type == "localReport" && defined(publishedAt)])`),
  ])

  const [
    { count: confirmedCount },
    { count: weeklyCount },
    { count: monthlyCount },
    { count: newRequestsCount },
  ] = await Promise.all([
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true).eq('is_active', true),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true).eq('is_active', true).eq('frequency', 'weekly'),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true).eq('is_active', true).eq('frequency', 'monthly'),
    supabase.from('valuation_requests').select('*', { count: 'exact', head: true }).eq('status', 'ny'),
  ])

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
          { label: 'Publiserte rapporter', value: postCount || 0, color: '#155356' },
          { label: 'Lokalrapporter', value: localReportCount || 0, color: '#D7B180' },
          { label: 'Totalt abonnenter', value: confirmedCount || 0 },
          { label: 'Ukentlige', value: weeklyCount || 0, color: '#155356' },
          { label: 'Månedlige', value: monthlyCount || 0, color: '#D7B180' },
          { label: 'Nye forespørsler', value: newRequestsCount || 0, color: '#B8860B' },
        ]}
      />
    </div>
  )
}
