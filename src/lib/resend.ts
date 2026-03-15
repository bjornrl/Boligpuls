import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: React.ReactElement
}) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'Boligpuls Trondheim <onboarding@resend.dev>',
    to: [to],
    subject,
    react,
  })
}
