import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, sendEmailHtml } from '@/lib/resend'
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

  const admin = createAdminClient()

  // Get subscribers based on report type
  // Weekly reports → only subscribers with frequency = 'weekly'
  // Monthly/quarterly/annual → ALL active confirmed subscribers
  let query = admin
    .from('subscribers')
    .select('*')
    .eq('is_active', true)
    .eq('confirmed', true)

  if (post.reportType === 'ukentlig') {
    query = query.eq('frequency', 'weekly')
  }

  const { data: subscribers } = await query

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 })
  }

  // Get HTML content — either directly from htmlContent or convert from portable text
  const isHtmlMode = post.contentMode === 'html' && post.htmlContent
  const contentHtml = isHtmlMode ? post.htmlContent! : portableTextToHtml(post.content)
  const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : formatDate(new Date().toISOString())

  // Build report type label
  const typeLabels: Record<string, string> = {
    ukentlig: 'Ukentlig oppdatering',
    manedlig: 'Månedlig rapport',
    kvartal: 'Kvartalsrapport',
    arsrapport: 'Årsrapport',
  }
  const reportLabel = typeLabels[post.reportType] || ''

  let sent = 0
  let failed = 0

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe?token=${subscriber.unsubscribe_token}`

    try {
      console.log(`[newsletter] Sending to ${subscriber.email}...`)

      if (isHtmlMode) {
        // For HTML content, send the raw HTML directly with footer appended
        const footer = `
          <hr style="border: none; border-top: 1px solid #E8ECEE; margin: 32px 0;" />
          <div style="text-align: center; padding: 20px 0; font-family: Arial, sans-serif;">
            <p style="font-size: 13px; color: #9BAFB2; margin: 0 0 8px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #155356;">eiendomtrondheim.no</a>
            </p>
            <p style="font-size: 12px; color: #9BAFB2; margin: 0;">
              <a href="${unsubscribeUrl}" style="color: #9BAFB2;">Avmeld nyhetsbrev</a>
            </p>
          </div>
        `
        await sendEmailHtml({
          to: subscriber.email,
          subject: `${post.title} — EIENDOM Trondheim`,
          html: contentHtml + footer,
        })
      } else {
        await sendEmail({
          to: subscriber.email,
          subject: `${post.title} — EIENDOM Trondheim`,
          react: NewsletterEmail({
            postTitle: post.title,
            reportLabel,
            reportPeriod: post.reportPeriod || '',
            contentHtml,
            publishedDate,
            unsubscribeUrl,
            bydeler: post.bydeler || [],
          }),
        })
      }

      await admin.from('newsletter_sends').insert({
        sanity_post_id: postId,
        subscriber_id: subscriber.id,
        status: 'sent',
      })
      sent++
    } catch (err) {
      console.error(`[newsletter] Failed to send to ${subscriber.email}:`, err)
      await admin.from('newsletter_sends').insert({
        sanity_post_id: postId,
        subscriber_id: subscriber.id,
        status: 'failed',
      })
      failed++
    }

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return NextResponse.json({ sent, failed, total: subscribers.length })
}
