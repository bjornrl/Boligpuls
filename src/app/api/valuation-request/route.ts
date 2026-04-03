import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/resend'
import ValuationConfirmEmail from '@/emails/ValuationConfirmEmail'
import ValuationNotifyEmail from '@/emails/ValuationNotifyEmail'

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
  const { name, email, phone, address, bydel, requestType, message } = body

  // Validate required fields
  if (!name || !email || !address || !requestType) {
    return NextResponse.json(
      { error: 'Navn, e-post, adresse og type er påkrevd.' },
      { status: 400 }
    )
  }

  const phoneTrimmed = typeof phone === 'string' ? phone.trim() : ''
  if (requestType === 'verdivurdering' && !phoneTrimmed) {
    return NextResponse.json(
      { error: 'Telefonnummer er påkrevd ved forespørsel om verdivurdering.' },
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

  if (!['verdivurdering', 'salgstilbud'].includes(requestType)) {
    return NextResponse.json(
      { error: 'Ugyldig forespørselstype.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Look up bydel_id from slug if provided
  let bydelId: string | null = null
  let bydelName: string | null = null
  if (bydel) {
    const { data: bydelRow } = await supabase
      .from('bydeler')
      .select('id, name')
      .eq('slug', bydel)
      .single()
    if (bydelRow) {
      bydelId = bydelRow.id
      bydelName = bydelRow.name
    }
  }

  // Insert valuation request
  const { error: insertError } = await supabase
    .from('valuation_requests')
    .insert({
      name,
      email,
      phone: phoneTrimmed || null,
      address,
      bydel_id: bydelId,
      request_type: requestType,
      message: message || null,
    })

  if (insertError) {
    console.error('Failed to insert valuation request:', insertError)
    return NextResponse.json(
      { error: 'Kunne ikke lagre forespørselen.' },
      { status: 500 }
    )
  }

  // Send notification email to admin
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `Ny forespørsel om ${requestType === 'verdivurdering' ? 'verdivurdering' : 'salgstilbud'} fra ${name}`,
        react: ValuationNotifyEmail({
          name,
          email,
          phone: phoneTrimmed || null,
          address,
          bydel: bydelName,
          requestType,
          message: message || null,
        }),
      })
    } catch (err) {
      console.error('Failed to send admin notification:', err)
    }
  }

  // Send confirmation email to user
  try {
    await sendEmail({
      to: email,
      subject: 'Vi har mottatt din henvendelse — EIENDOM Trondheim',
      react: ValuationConfirmEmail({ name, requestType }),
    })
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
  }

  return NextResponse.json({ success: true })
}
