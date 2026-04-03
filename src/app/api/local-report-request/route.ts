import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/resend'
import LocalReportConfirmEmail from '@/emails/LocalReportConfirmEmail'
import LocalReportNotifyEmail from '@/emails/LocalReportNotifyEmail'

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
  const { name, email, phone, address, message } = body

  if (!name || !email || !address) {
    return NextResponse.json(
      { error: 'Navn, e-post og adresse er påkrevd.' },
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

  const { error: insertError } = await supabase
    .from('local_report_requests')
    .insert({
      name,
      email,
      phone: typeof phone === 'string' ? phone.trim() || null : null,
      address,
      message: message || null,
    })

  if (insertError) {
    console.error('Failed to insert local report request:', insertError)
    return NextResponse.json(
      { error: 'Kunne ikke lagre forespørselen.' },
      { status: 500 }
    )
  }

  // Send confirmation email to user
  try {
    await sendEmail({
      to: email,
      subject: 'Vi har mottatt din forespørsel — Eiendom Trondheim',
      react: LocalReportConfirmEmail({ name, address }),
    })
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
  }

  // Send notification email to admin
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: `Ny forespørsel om lokalrapport: ${address}`,
        react: LocalReportNotifyEmail({
          name,
          email,
          phone: typeof phone === 'string' ? phone.trim() || null : null,
          address,
          message: message || null,
        }),
      })
    } catch (err) {
      console.error('Failed to send admin notification:', err)
    }
  }

  return NextResponse.json({ success: true })
}
