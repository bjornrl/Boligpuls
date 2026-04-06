'use client'
import { useEffect, useRef, useState } from 'react'

export function HtmlContentViewer({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(800)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const updateHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) return
        const html = doc.documentElement
        const body = doc.body
        if (!html || !body) return
        // Take the max of all possible height measurements
        const h = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.scrollHeight,
          html.offsetHeight,
        )
        if (h > 0) setHeight(h)
      } catch { /* cross-origin */ }
    }

    const onLoad = () => {
      // Initial measurement + a few delayed ones for images/fonts
      updateHeight()
      setTimeout(updateHeight, 100)
      setTimeout(updateHeight, 500)
      setTimeout(updateHeight, 1500)
      try {
        const doc = iframe.contentDocument
        if (doc) {
          doc.addEventListener('toggle', () => setTimeout(updateHeight, 100), true)
          doc.addEventListener('click', () => setTimeout(updateHeight, 200))
          const observer = new ResizeObserver(() => setTimeout(updateHeight, 50))
          observer.observe(doc.documentElement)
        }
      } catch { /* cross-origin */ }
    }

    iframe.addEventListener('load', onLoad)
    return () => iframe.removeEventListener('load', onLoad)
  }, [html])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={html}
      style={{
        width: '100%',
        height: `${height}px`,
        border: 'none',
        borderRadius: 12,
      }}
      scrolling="no"
      title="Rapport"
      sandbox="allow-same-origin allow-scripts allow-popups"
    />
  )
}
