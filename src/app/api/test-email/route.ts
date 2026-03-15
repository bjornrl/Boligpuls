import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('=== TEST EMAIL START ===')
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
  console.log('RESEND_API_KEY starts with:', process.env.RESEND_API_KEY?.substring(0, 10))
  console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Eiendom Trondheim <onboarding@resend.dev>',
      to: ['bjornrleira@gmail.com'],
      subject: 'Boligpuls Test — Resend fungerer!',
      html: '<h1>Resend fungerer!</h1><p>Denne e-posten ble sendt fra Boligpuls test-route.</p>',
    })

    console.log('Resend response data:', JSON.stringify(data))
    console.log('Resend response error:', JSON.stringify(error))
    console.log('=== TEST EMAIL END ===')

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Resend EXCEPTION:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
