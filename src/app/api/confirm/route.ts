import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/resend'
import WelcomeEmail from '@/emails/WelcomeEmail'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/nyhetsbrev/bekreft?status=error', request.url))
  }

  const supabase = createAdminClient()

  // Find subscriber by token
  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('id, name, email, frequency, confirm_token')
    .eq('confirm_token', token)
    .single()

  if (!subscriber) {
    return NextResponse.redirect(new URL('/nyhetsbrev/bekreft?status=error', request.url))
  }

  // Confirm
  await supabase
    .from('subscribers')
    .update({ confirmed: true })
    .eq('id', subscriber.id)

  // Get bydeler for welcome email
  const { data: subscriberBydeler } = await supabase
    .from('subscriber_bydeler')
    .select('bydeler(name, emoji)')
    .eq('subscriber_id', subscriber.id)

  const bydeler = (subscriberBydeler || []).map((sb: unknown) => {
    const item = sb as { bydeler: { name: string; emoji: string } | null }
    return {
      name: item.bydeler?.name || '',
      emoji: item.bydeler?.emoji || '',
    }
  })

  // Send welcome email
  try {
    await sendEmail({
      to: subscriber.email,
      subject: 'Velkommen til Boligpuls Trondheim!',
      react: WelcomeEmail({
        name: subscriber.name,
        bydeler,
        frequency: subscriber.frequency,
      }),
    })
  } catch (err) {
    console.error('Failed to send welcome email:', err)
  }

  return NextResponse.redirect(new URL('/nyhetsbrev/bekreft?status=success', request.url))
}
