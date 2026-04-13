'use client'
import { useEffect, useRef, useState, useMemo } from 'react'

/** Script injected into the iframe to report its own height via postMessage */
const HEIGHT_REPORTER_SCRIPT = `
<script>
(function() {
  var uid = document.currentScript.getAttribute('data-uid');
  function reportHeight() {
    var h = Math.max(
      document.body.scrollHeight || 0,
      document.body.offsetHeight || 0,
      document.documentElement.scrollHeight || 0,
      document.documentElement.offsetHeight || 0
    );
    if (h > 0) {
      window.parent.postMessage({ type: 'iframe-height', uid: uid, height: h }, '*');
    }
  }

  // Report on load
  reportHeight();

  // Re-report after short delays for images/fonts
  setTimeout(reportHeight, 100);
  setTimeout(reportHeight, 500);
  setTimeout(reportHeight, 1500);
  setTimeout(reportHeight, 3000);

  // Re-report when any image finishes loading
  document.querySelectorAll('img').forEach(function(img) {
    if (!img.complete) {
      img.addEventListener('load', function() { setTimeout(reportHeight, 50); });
      img.addEventListener('error', function() { setTimeout(reportHeight, 50); });
    }
  });

  // Re-report on any resize/mutation
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(function() { setTimeout(reportHeight, 50); })
      .observe(document.documentElement);
  }
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function() { setTimeout(reportHeight, 50); })
      .observe(document.body, { childList: true, subtree: true, attributes: true });
  }

  // Re-report on toggle (details/summary) and click
  document.addEventListener('toggle', function() { setTimeout(reportHeight, 100); }, true);
  document.addEventListener('click', function() { setTimeout(reportHeight, 200); });

  // Re-report on window resize (orientation change on mobile)
  window.addEventListener('resize', function() { setTimeout(reportHeight, 100); });
})();
</script>
`;

/** Styles injected to ensure the iframe body doesn't constrain content height */
const HEIGHT_FIX_STYLES = `
<style>
  html, body {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    overflow-y: visible !important;
  }
</style>
`;

let uidCounter = 0

export function HtmlContentViewer({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(800)
  const uid = useMemo(() => `iframe-${++uidCounter}`, [])

  // Inject the height reporter script and height-fix styles into the HTML
  const augmentedHtml = useMemo(() => {
    let result = html
    const scriptTag = HEIGHT_REPORTER_SCRIPT.replace(
      '<script>',
      `<script data-uid="${uid}">`
    )
    // Inject styles into <head> if present, otherwise prepend
    if (result.includes('</head>')) {
      result = result.replace('</head>', HEIGHT_FIX_STYLES + '</head>')
    } else {
      result = HEIGHT_FIX_STYLES + result
    }
    // Inject script before </body> if present, otherwise append
    if (result.includes('</body>')) {
      result = result.replace('</body>', scriptTag + '</body>')
    } else {
      result = result + scriptTag
    }
    return result
  }, [html, uid])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        e.data &&
        e.data.type === 'iframe-height' &&
        e.data.uid === uid &&
        typeof e.data.height === 'number' &&
        e.data.height > 0
      ) {
        setHeight((prev) => Math.max(prev, e.data.height))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [uid])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={augmentedHtml}
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
