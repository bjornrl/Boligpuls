'use client'

import { useEffect, useRef } from 'react'

type Props = {
  html: string
  title?: string
}

/** Renders newsletter/MJML HTML safely inside a sandboxed iframe. */
export function SanitizedNewsletterHtml({ html, title }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const resizeObserver = new ResizeObserver(() => {
      const doc = iframe.contentDocument
      if (doc?.body) {
        iframe.style.height = `${doc.body.scrollHeight}px`
      }
    })

    const handleLoad = () => {
      const doc = iframe.contentDocument
      if (doc?.body) {
        iframe.style.height = `${doc.body.scrollHeight}px`
        resizeObserver.observe(doc.body)
      }
    }

    iframe.addEventListener('load', handleLoad)
    return () => {
      iframe.removeEventListener('load', handleLoad)
      resizeObserver.disconnect()
    }
  }, [html])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      title={title || 'Nyhetsbrev'}
      sandbox="allow-same-origin allow-popups"
      style={{ width: '100%', minHeight: '80vh', border: 'none' }}
    />
  )
}
