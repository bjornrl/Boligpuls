import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, sendEmailHtml } from '@/lib/resend'
import { formatDate } from '@/lib/utils'
import { sanityWriteClient } from '@/sanity/client'
import { postByIdQuery } from '@/sanity/queries'
import mjml2html from 'mjml'
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
  console.log('[newsletter] Send request received, postId:', postId)

  if (!postId) {
    return NextResponse.json({ error: 'postId er påkrevd' }, { status: 400 })
  }

  // Fetch post from Sanity (use write client for fresh, non-CDN data)
  const post = await sanityWriteClient.fetch<SanityPost | null>(postByIdQuery, { id: postId })

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

  const { data: subscribers, error: subscriberError } = await query
  console.log('[newsletter] Found subscribers:', subscribers?.length ?? 0, 'error:', subscriberError)

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, total: 0 })
  }

  // Get HTML content — either directly from htmlContent or convert from portable text
  const isHtmlMode = post.contentMode === 'html' && post.htmlContent
  let contentHtml: string
  if (isHtmlMode) {
    const raw = post.htmlContent!
    // Compile MJML to HTML if content is MJML format
    if (post.contentFormat === 'mjml' || raw.trim().startsWith('<mjml>') || raw.trim().startsWith('<mjml ')) {
      console.log('[newsletter] Compiling MJML to HTML...')
      const mjmlResult = mjml2html(raw)
      if (mjmlResult.errors?.length) {
        console.warn('[newsletter] MJML warnings:', mjmlResult.errors)
      }
      contentHtml = mjmlResult.html
    } else {
      contentHtml = raw
    }
  } else {
    contentHtml = portableTextToHtml(post.content)
  }
  const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : formatDate(new Date().toISOString())

  // Build report type label
  const typeLabels: Record<string, string> = {
    ukentlig: 'Ukentlig oppdatering',
    manedlig: 'Månedlig rapport',
    kvartal: 'Kvartalsrapport',
    arsrapport: 'Årsrapport',
    lokalmarkedet: 'Lokalmarkedet',
  }
  const reportLabel = typeLabels[post.reportType] || ''

  let sent = 0
  let failed = 0

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/unsubscribe?token=${subscriber.unsubscribe_token}`

    try {
      console.log(`[newsletter] Sending to ${subscriber.email}...`)

      if (isHtmlMode) {
        // For HTML content, send the raw HTML directly with footer injected
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
        // Insert footer before </body> if present (MJML-compiled), otherwise append
        let emailHtml: string
        if (contentHtml.includes('</body>')) {
          emailHtml = contentHtml.replace('</body>', footer + '</body>')
        } else {
          emailHtml = contentHtml + footer
        }
        await sendEmailHtml({
          to: subscriber.email,
          subject: `${post.title} — EIENDOM Trondheim`,
          html: emailHtml,
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
