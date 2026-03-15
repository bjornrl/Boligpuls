import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/resend'
import ConfirmEmail from '@/emails/ConfirmEmail'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 })
    return false
  }
  entry.count++
  return entry.count > 5
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'For mange forsøk. Prøv igjen senere.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { email, name, bydeler, frequency } = body

  // Validate
  if (!email || !name || !bydeler || bydeler.length === 0) {
    return NextResponse.json(
      { error: 'Navn, e-post og minst én bydel er påkrevd.' },
      { status: 400 }
    )
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: 'Ugyldig e-postadresse.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Check if email already exists
  const { data: existing, error: lookupError } = await supabase
    .from('subscribers')
    .select('id, confirmed, is_active, confirm_token')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) {
    console.error('Subscriber lookup error:', lookupError)
    return NextResponse.json(
      { error: 'Noe gikk galt. Prøv igjen senere.' },
      { status: 500 }
    )
  }

  if (existing) {
    if (existing.confirmed && existing.is_active) {
      return NextResponse.json(
        { error: 'Denne e-postadressen er allerede registrert og bekreftet.' },
        { status: 409 }
      )
    }

    // Unconfirmed — update and resend
    if (!existing.confirmed) {
      // Look up bydel IDs from slugs
      const { data: bydelRows } = await supabase
        .from('bydeler')
        .select('id')
        .in('slug', bydeler)

      if (!bydelRows || bydelRows.length === 0) {
        return NextResponse.json({ error: 'Ugyldige bydeler.' }, { status: 400 })
      }

      // Update subscriber
      await supabase
        .from('subscribers')
        .update({ name, frequency: frequency || 'weekly' })
        .eq('id', existing.id)

      // Delete old bydel links and re-insert
      await supabase.from('subscriber_bydeler').delete().eq('subscriber_id', existing.id)
      await supabase.from('subscriber_bydeler').insert(
        bydelRows.map((b) => ({ subscriber_id: existing.id, bydel_id: b.id }))
      )

      const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm?token=${existing.confirm_token}`
      try {
        await sendEmail({
          to: email,
          subject: 'Bekreft e-postadressen din — Eiendom Trondheim',
          react: ConfirmEmail({ name, confirmUrl }),
        })
      } catch (err) {
        console.error('Failed to send confirmation email:', err)
      }

      return NextResponse.json({ success: true })
    }
  }

  // Look up bydel IDs from slugs
  const { data: bydelRows } = await supabase
    .from('bydeler')
    .select('id')
    .in('slug', bydeler)

  if (!bydelRows || bydelRows.length === 0) {
    return NextResponse.json({ error: 'Ugyldige bydeler.' }, { status: 400 })
  }

  // Create subscriber
  const { data: subscriber, error: subError } = await supabase
    .from('subscribers')
    .insert({
      email,
      name,
      frequency: frequency || 'weekly',
    })
    .select('id, confirm_token')
    .single()

  if (subError || !subscriber) {
    return NextResponse.json(
      { error: 'Kunne ikke opprette abonnement.' },
      { status: 500 }
    )
  }

  // Link bydeler
  await supabase.from('subscriber_bydeler').insert(
    bydelRows.map((b) => ({ subscriber_id: subscriber.id, bydel_id: b.id }))
  )

  // Send confirmation email
  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/confirm?token=${subscriber.confirm_token}`
  console.log('[subscribe] About to send confirmation email to:', email)
  console.log('[subscribe] confirmUrl:', confirmUrl)
  try {
    await sendEmail({
      to: email,
      subject: 'Bekreft e-postadressen din — Eiendom Trondheim',
      react: ConfirmEmail({ name, confirmUrl }),
    })
    console.log('[subscribe] Email sent successfully')
  } catch (err) {
    console.error('[subscribe] Failed to send confirmation email:', err)
    // Still return success since subscriber was created
  }

  return NextResponse.json({ success: true })
}
