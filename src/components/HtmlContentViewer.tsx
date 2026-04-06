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
        if (doc?.body) {
          setHeight(Math.max(doc.body.scrollHeight + 32, 400))
        }
      } catch { /* cross-origin */ }
    }

    const onLoad = () => {
      updateHeight()
      try {
        const doc = iframe.contentDocument
        if (doc) {
          doc.addEventListener('toggle', () => setTimeout(updateHeight, 100), true)
          doc.addEventListener('click', () => setTimeout(updateHeight, 200))
          const observer = new ResizeObserver(() => setTimeout(updateHeight, 50))
          observer.observe(doc.body)
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
        transition: 'height 0.3s ease',
      }}
      title="Rapport"
      sandbox="allow-same-origin allow-scripts allow-popups"
    />
  )
}
