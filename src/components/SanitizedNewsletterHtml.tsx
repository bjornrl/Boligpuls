'use client'

type Props = {
  html: string
  title?: string
}

/** Renders uploaded HTML content inline with responsive containment. */
export function SanitizedNewsletterHtml({ html }: Props) {
  return (
    <div
      className="newsletter-html-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
