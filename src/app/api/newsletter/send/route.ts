import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/resend'
import { formatDate } from '@/lib/utils'
import { sanityClient } from '@/sanity/client'
import { postByIdQuery } from '@/sanity/queries'
import { portableTextToHtml } from '@/sanity/portableTextToHtml'
import type { SanityPost } from '@/sanity/types'
import NewsletterEmail from '@/emails/NewsletterEmail'

export async function POST(request: NextRequest) {
  // Verify auth via session
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Ikke autorisert' }, { status: 401 })
  }

  const { postId } = await request.json()

  if (!postId) {
    return NextResponse.json({ error: 'postId er påkrevd' }, { status: 400 })
  }

  // Fetch post from Sanity
  const post = await sanityClient.fetch<SanityPost | null>(postByIdQuery, { id: postId })

  if (!post) {
    return NextResponse.json({ error: 'Innlegg ikke funnet' }, { status: 404 })
  }

  const bydel = post.bydel

  if (!bydel) {
    return NextResponse.json({ error: 'Innlegget mangler bydel' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Look up the bydel slug in Supabase subscriber_bydeler
  // We need to match Sanity bydel to Supabase bydel by slug
  const { data: supabaseBydel } = await admin
    .from('bydeler')
    .select('id')
    .eq('slug', bydel.slug)
    .single()

  if (!supabaseBydel) {
    return NextResponse.json({ error: 'Bydelen finnes ikke i abonnent-systemet' }, { status: 404 })
  }

  // Get active + confirmed subscribers for this bydel
  const { data: subscriberLinks } = await admin
    .from('subscriber_bydeler')
    .select('subscriber_id')
    .eq('bydel_id', supabaseBydel.id)

  if (!subscriberLinks || subscriberLinks.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 })
  }

  const subscriberIds = subscriberLinks.map((l) => l.subscriber_id)

  const { data: subscribers } = await admin
    .from('subscribers')
    .select('*')
    .in('id', subscriberIds)
    .eq('is_active', true)
    .eq('confirmed', true)

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 })
  }

  // Convert portable text to HTML
  const contentHtml = portableTextToHtml(post.content)
  const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : formatDate(new Date().toISOString())

  let sent = 0
  let failed = 0

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe?token=${subscriber.unsubscribe_token}`

    try {
      await sendEmail({
        to: subscriber.email,
        subject: `${post.title} — Boligpuls ${bydel.name}`,
        react: NewsletterEmail({
          postTitle: post.title,
          bydelName: bydel.name,
          bydelEmoji: bydel.emoji || '',
          bydelColor: bydel.color,
          contentHtml,
          publishedDate,
          unsubscribeUrl,
        }),
      })

      await admin.from('newsletter_sends').insert({
        post_id: postId,
        subscriber_id: subscriber.id,
        status: 'sent',
      })
      sent++
    } catch {
      await admin.from('newsletter_sends').insert({
        post_id: postId,
        subscriber_id: subscriber.id,
        status: 'failed',
      })
      failed++
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return NextResponse.json({ sent, failed, total: subscribers.length })
}
