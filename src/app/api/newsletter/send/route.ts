import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.NEWSLETTER_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await request.json()

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  // Get the post with bydel
  const { data: post } = await supabase
    .from('posts')
    .select('*, bydeler(*)')
    .eq('id', postId)
    .eq('is_published', true)
    .single()

  if (!post) {
    return NextResponse.json({ error: 'Post not found or not published' }, { status: 404 })
  }

  // Get subscribers who follow this bydel and are confirmed
  const { data: subscriberLinks } = await supabase
    .from('subscriber_bydeler')
    .select('subscriber_id')
    .eq('bydel_id', post.bydel_id)

  if (!subscriberLinks || subscriberLinks.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No subscribers for this bydel' })
  }

  const subscriberIds = subscriberLinks.map((l) => l.subscriber_id)

  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .in('id', subscriberIds)
    .eq('is_active', true)
    .eq('confirmed', true)

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No confirmed subscribers' })
  }

  // Check who has already received this post
  const { data: alreadySent } = await supabase
    .from('newsletter_sends')
    .select('subscriber_id')
    .eq('post_id', postId)
    .eq('status', 'sent')

  const alreadySentIds = new Set(alreadySent?.map((s) => s.subscriber_id) || [])
  const toSend = subscribers.filter((s) => !alreadySentIds.has(s.id))

  let sentCount = 0
  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/artikler/${post.slug}`

  for (const subscriber of toSend) {
    try {
      await resend.emails.send({
        from: 'Boligpuls Trondheim <noreply@boligpuls.no>',
        to: subscriber.email,
        subject: `${post.title} — Boligpuls ${(post as { bydeler: { name: string } }).bydeler.name}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
            <div style="background-color: ${(post as { bydeler: { color: string } }).bydeler.color}; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Boligpuls Trondheim</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">${(post as { bydeler: { name: string } }).bydeler.name}</p>
            </div>
            <div style="padding: 24px; background: white; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="margin-top: 0;">${post.title}</h2>
              <p style="color: #666;">${post.excerpt}</p>
              <a href="${postUrl}" style="background-color: #E8634A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">Les hele artikkelen</a>
            </div>
          </div>
        `,
      })

      await supabase.from('newsletter_sends').insert({
        post_id: postId,
        subscriber_id: subscriber.id,
        status: 'sent',
      })

      sentCount++
    } catch {
      await supabase.from('newsletter_sends').insert({
        post_id: postId,
        subscriber_id: subscriber.id,
        status: 'failed',
      })
    }
  }

  return NextResponse.json({ sent: sentCount, total: toSend.length })
}
