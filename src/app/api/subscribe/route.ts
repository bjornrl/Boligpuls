import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, name, frequency, bydeler } = body

  if (!email || !bydeler || bydeler.length === 0) {
    return NextResponse.json(
      { error: 'E-post og minst en bydel er påkrevd.' },
      { status: 400 }
    )
  }

  const supabase = createServerSupabaseClient()

  // Check if subscriber already exists
  const { data: existing } = await supabase
    .from('subscribers')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: 'Denne e-postadressen er allerede registrert.' },
      { status: 409 }
    )
  }

  // Create subscriber
  const { data: subscriber, error: subError } = await supabase
    .from('subscribers')
    .insert({
      email,
      name: name || '',
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
  const bydelLinks = bydeler.map((bydel_id: string) => ({
    subscriber_id: subscriber.id,
    bydel_id,
  }))

  await supabase.from('subscriber_bydeler').insert(bydelLinks)

  // Send confirmation email
  const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/bekreft?token=${subscriber.confirm_token}`

  try {
    await resend.emails.send({
      from: 'Boligpuls Trondheim <noreply@boligpuls.no>',
      to: email,
      subject: 'Bekreft abonnementet ditt — Boligpuls Trondheim',
      html: `
        <h2>Velkommen til Boligpuls Trondheim!</h2>
        <p>Takk for at du abonnerer. Klikk lenken under for å bekrefte abonnementet ditt:</p>
        <p><a href="${confirmUrl}" style="background-color: #E8634A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Bekreft abonnement</a></p>
        <p>Hvis du ikke ba om dette, kan du ignorere denne e-posten.</p>
      `,
    })
  } catch {
    // Email sending failed, but subscriber is created
    console.error('Failed to send confirmation email')
  }

  return NextResponse.json({ success: true })
}
