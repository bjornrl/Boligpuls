import { sanityClient } from '@/sanity/client'
import { postByIdQuery } from '@/sanity/queries'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDate } from '@/lib/utils'
import BydelPill from '@/components/BydelPill'
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

  // Get subscriber count from Supabase
  let subscriberCount = 0
  if (post.bydel?.slug) {
    const admin = createAdminClient()
    const { data: bydelData } = await admin
      .from('bydeler')
      .select('id')
      .eq('slug', post.bydel.slug.toLowerCase())
      .maybeSingle()

    if (bydelData) {
      const { count } = await admin
        .from('subscriber_bydeler')
        .select('subscriber_id, subscribers!inner(confirmed, is_active)', { count: 'exact', head: true })
        .eq('bydel_id', bydelData.id)
        .eq('subscribers.confirmed', true)
        .eq('subscribers.is_active', true)

      subscriberCount = count || 0
    }
  }

  return (
    <div className="max-w-3xl">
      <h1
        className="text-3xl mb-6"
        style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
      >
        Send nyhetsbrev
      </h1>

      <div className="flex items-center gap-3 mb-6">
        {post.bydel && (
          <BydelPill
            name={post.bydel.name}
            emoji={post.bydel.emoji}
            color={post.bydel.color}
            size="md"
          />
        )}
        <span className="text-sm" style={{ color: '#5F7A7D' }}>
          {subscriberCount} mottakere
        </span>
      </div>

      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
      >
        <div className="h-1.5" style={{ backgroundColor: post.bydel?.color || '#002D32' }} />
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
