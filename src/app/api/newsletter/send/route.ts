import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmailHtml } from '@/lib/resend'
import { formatDate } from '@/lib/utils'
import { sanityWriteClient } from '@/sanity/client'
import { postByIdQuery } from '@/sanity/queries'
import type { SanityPost } from '@/sanity/types'

const badgeConfig: Record<string, { color: string; emoji: string; text: string }> = {
  ukentlig: { color: '#155356', emoji: '📊', text: 'Ukentlig' },
  manedlig: { color: '#D7B180', emoji: '📈', text: 'Månedlig' },
  kvartal: { color: '#002D32', emoji: '📋', text: 'Kvartalsrapport' },
  arsrapport: { color: '#7B5EA7', emoji: '📑', text: 'Årsrapport' },
  artikkel: { color: '#155356', emoji: '📝', text: 'Artikkel' },
}

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

  const badge = badgeConfig[post.reportType] || badgeConfig.ukentlig
  const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : formatDate(new Date().toISOString())
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eiendomtrondheim.no'

  let sent = 0
  let failed = 0

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #F8F7F5; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden;">
    <tr>
      <td style="background-color: #002D32; padding: 24px 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">
          Eiendom Trondheim
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 0;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 100px; background-color: ${badge.color}15; color: ${badge.color}; font-size: 12px; font-weight: 700;">
          ${badge.emoji} ${badge.text}
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 32px 0;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #002D32; line-height: 1.3;">
          ${post.title}
        </h2>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px 32px 0;">
        <p style="margin: 0; font-size: 13px; color: #9BAFB2;">
          ${post.reportPeriod ? post.reportPeriod + ' &middot; ' : ''}${publishedDate}
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px;">
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #44403C;">
          ${post.excerpt || ''}
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 32px 32px;">
        <a href="${baseUrl}/post/${post.slug}"
           style="display: inline-block; padding: 14px 32px; background-color: #D7B180; color: #002D32; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 700;">
          ${post.reportType === 'artikkel' ? 'Les hele artikkelen' : 'Les hele rapporten'} &rarr;
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px; border-top: 1px solid #E8ECEE; text-align: center;">
        <p style="margin: 0 0 8px; font-size: 13px;">
          <a href="${baseUrl}" style="color: #155356; text-decoration: underline;">
            eiendomtrondheim.no
          </a>
        </p>
        <p style="margin: 0; font-size: 12px; color: #9BAFB2;">
          <a href="${unsubscribeUrl}" style="color: #9BAFB2; text-decoration: underline;">
            Avmeld nyhetsbrev
          </a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`

    try {
      console.log(`[newsletter] Sending to ${subscriber.email}...`)

      await sendEmailHtml({
        to: subscriber.email,
        subject: `${post.title} — EIENDOM Trondheim`,
        html: emailHtml,
      })

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
