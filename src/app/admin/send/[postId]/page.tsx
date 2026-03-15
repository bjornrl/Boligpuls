import { sanityClient } from '@/sanity/client'
import { postByIdQuery } from '@/sanity/queries'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDate } from '@/lib/utils'
import { reportTypeConfig } from '@/sanity/types'
import SendNewsletterButton from './SendNewsletterButton'
import type { SanityPost } from '@/sanity/types'

export const revalidate = 60

export const metadata = { title: 'Send nyhetsbrev — Admin' }

export default async function SendPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params

  const post = await sanityClient.fetch<SanityPost | null>(postByIdQuery, { id: postId })

  if (!post) {
    return (
      <div className="py-12" style={{ color: '#9BAFB2' }}>
        Innlegget ble ikke funnet.
      </div>
    )
  }

  const config = reportTypeConfig[post.reportType]

  // Get subscriber count
  const admin = createAdminClient()
  let query = admin
    .from('subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('confirmed', true)

  // Weekly reports only go to weekly subscribers
  if (post.reportType === 'ukentlig') {
    query = query.eq('frequency', 'weekly')
  }

  const { count } = await query
  const subscriberCount = count || 0

  return (
    <div className="max-w-3xl">
      <h1
        className="text-3xl mb-6"
        style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
      >
        Send nyhetsbrev
      </h1>

      <div className="flex items-center gap-3 mb-6">
        {config && (
          <span
            className="text-sm font-medium px-3 py-1 rounded-full"
            style={{ backgroundColor: `${config.color}15`, color: config.color }}
          >
            {config.emoji} {config.label}
          </span>
        )}
        {post.reportPeriod && (
          <span className="text-sm" style={{ color: '#5F7A7D' }}>
            {post.reportPeriod}
          </span>
        )}
        <span className="text-sm" style={{ color: '#5F7A7D' }}>
          {subscriberCount} mottakere
          {post.reportType === 'ukentlig' && ' (kun ukentlige abonnenter)'}
        </span>
      </div>

      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
      >
        <div className="h-1.5" style={{ backgroundColor: config?.color || '#002D32' }} />
        <div className="p-8">
          <p className="text-sm mb-2" style={{ color: '#9BAFB2' }}>
            {post.publishedAt ? formatDate(post.publishedAt) : '—'}
          </p>
          <h2
            className="text-2xl mb-4"
            style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
          >
            {post.title}
          </h2>
          <p style={{ color: '#5F7A7D' }}>{post.excerpt}</p>
        </div>
      </div>

      <SendNewsletterButton postId={post._id} subscriberCount={subscriberCount} />
    </div>
  )
}
