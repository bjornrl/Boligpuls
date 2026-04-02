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
    .maybeSingle()

  if (!subscriber) {
    return NextResponse.redirect(new URL('/nyhetsbrev/bekreft?status=error', request.url))
  }

  // Confirm
  await supabase
    .from('subscribers')
    .update({ confirmed: true })
    .eq('id', subscriber.id)

  // Send welcome email
  try {
    await sendEmail({
      to: subscriber.email,
      subject: 'Velkommen til EIENDOM Trondheim!',
      react: WelcomeEmail({
        name: subscriber.name,
        frequency: subscriber.frequency,
      }),
    })
  } catch (err) {
    console.error('Failed to send welcome email:', err)
  }

  return NextResponse.redirect(new URL('/nyhetsbrev/bekreft?status=success', request.url))
}
