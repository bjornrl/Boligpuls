import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: React.ReactElement
}) {
  const from = process.env.RESEND_FROM_EMAIL || 'Eiendom Trondheim <onboarding@resend.dev>'
  console.log('[sendEmail] Sending email:', { from, to, subject })
  console.log('[sendEmail] RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    react,
  })

  if (error) {
    console.error('[sendEmail] Resend error:', JSON.stringify(error))
    throw new Error(`Resend error: ${JSON.stringify(error)}`)
  }

  console.log('[sendEmail] Success:', JSON.stringify(data))
  return { data, error }
}

export async function sendEmailHtml({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const from = process.env.RESEND_FROM_EMAIL || 'Eiendom Trondheim <onboarding@resend.dev>'
  console.log('[sendEmailHtml] Sending HTML email:', { from, to, subject })

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  })

  if (error) {
    console.error('[sendEmailHtml] Resend error:', JSON.stringify(error))
    throw new Error(`Resend error: ${JSON.stringify(error)}`)
  }

  console.log('[sendEmailHtml] Success:', JSON.stringify(data))
  return { data, error }
}
