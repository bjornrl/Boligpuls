import { sanitizeNewsletter } from '@/lib/sanitize'

type Props = {
  html: string
}

/** Renders sanitized newsletter/MJML HTML in-flow (no iframe → height follows content). */
export function SanitizedNewsletterHtml({ html }: Props) {
  return (
    <div
      className="newsletter-html max-w-none overflow-x-auto [&_img]:h-auto [&_img]:max-w-full [&_table]:max-w-full"
      dangerouslySetInnerHTML={{ __html: sanitizeNewsletter(html) }}
    />
  )
}
