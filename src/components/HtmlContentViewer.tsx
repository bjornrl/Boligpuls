'use client'
import { useEffect, useId, useRef, useState, useMemo } from 'react'

/** Script injected into the iframe to report its own height via postMessage.
 * Measures document.body.scrollHeight only — documentElement values are clamped
 * to the viewport (iframe) height by the browser and would create a feedback
 * loop where each parent height bump grows the documentElement, which reports
 * a larger height, which grows the iframe again. */
const HEIGHT_REPORTER_SCRIPT = `
<script>
(function() {
  var uid = document.currentScript.getAttribute('data-uid');
  function reportHeight() {
    var h = document.body.scrollHeight || 0;
    if (h <= 0) return;
    window.parent.postMessage({ type: 'iframe-height', uid: uid, height: h }, '*');
  }

  // Respond to explicit height-request handshake from the parent (handles
  // SSR refresh, where the iframe may finish loading and dispatch its
  // initial messages before the parent's React hydration attaches its
  // message listener).
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'iframe-request-height' && e.data.uid === uid) {
      reportHeight();
    }
  });

  // Report on load
  reportHeight();

  // Re-report when any image finishes loading
  document.querySelectorAll('img').forEach(function(img) {
    if (!img.complete) {
      img.addEventListener('load', function() { setTimeout(reportHeight, 50); });
      img.addEventListener('error', function() { setTimeout(reportHeight, 50); });
    }
  });

  // Re-report when body content changes size. Observing body (not
  // documentElement) — body has height:auto so its size reflects actual
  // content, not the iframe viewport.
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(function() { setTimeout(reportHeight, 50); })
      .observe(document.body);
  }
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function() { setTimeout(reportHeight, 100); })
      .observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'open']
      });
  }

  // Re-report on click (for "Les mer", SVG onclick, etc.)
  document.addEventListener('click', function() {
    setTimeout(reportHeight, 50);
    setTimeout(reportHeight, 200);
    setTimeout(reportHeight, 500);
    setTimeout(reportHeight, 1000);
  });

  // Re-report on toggle (details/summary)
  document.addEventListener('toggle', function() {
    setTimeout(reportHeight, 50);
    setTimeout(reportHeight, 300);
  }, true);

  // Re-report on transitionend (for max-height animations)
  document.addEventListener('transitionend', function() {
    setTimeout(reportHeight, 50);
  });

  // Periodic check for the first 5 seconds as fallback
  var checks = 0;
  var interval = setInterval(function() {
    reportHeight();
    checks++;
    if (checks > 20) clearInterval(interval);
  }, 250);

  // Re-report on window resize (orientation change on mobile)
  window.addEventListener('resize', reportHeight);
})();
</script>
`;

/** Styles injected to ensure the iframe body doesn't constrain content height,
 *  and to force the "Ukens observasjon" (.observasjon) section to always render
 *  expanded — its toggle was triggering height-feedback issues. */
const HEIGHT_FIX_STYLES = `
<style>
  html, body {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    overflow-y: visible !important;
  }
  /* Force .observasjon section always-open: cancel every collapse mechanism
     the report's own CSS uses (max-height clamp, opacity fade, padding
     collapse) and force-apply the open-state styles. */
  .observasjon, .observasjon * {
    max-height: none !important;
  }
  .observasjon .observasjon-text,
  .observasjon [class*="-text"],
  .observasjon [class*="content"] {
    opacity: 1 !important;
    visibility: visible !important;
  }
  .observasjon .observasjon-text {
    padding: 16px 4px 8px 6px !important;
  }
  .observasjon [hidden] { display: revert !important; }
  /* Hide the "Les mer" trigger row entirely — content is always visible
     so the affordance is meaningless. */
  .observasjon .obs-trigger,
  .observasjon [class*="trigger"],
  .observasjon [class*="les-mer"],
  .observasjon [class*="read-more"] { display: none !important; }
  /* Generic toggle affordances */
  .observasjon summary::-webkit-details-marker { display: none !important; }
  .observasjon summary { list-style: none !important; cursor: default !important; }
  .observasjon [data-toggle],
  .observasjon .toggle,
  .observasjon .chevron,
  .observasjon [aria-expanded] svg,
  .observasjon button[aria-expanded] { pointer-events: none !important; }
</style>
`;

/** Script that forces every .observasjon block to stay expanded, regardless
 *  of which expand/collapse pattern the report HTML uses. */
const OBSERVASJON_LOCK_SCRIPT = `
<script>
(function() {
  function lockOpen() {
    var sections = document.querySelectorAll('.observasjon');
    sections.forEach(function(section) {
      // <details> pattern
      if (section.tagName === 'DETAILS') section.open = true;
      section.querySelectorAll('details').forEach(function(d) { d.open = true; });
      // aria-expanded pattern
      section.querySelectorAll('[aria-expanded="false"]').forEach(function(el) {
        el.setAttribute('aria-expanded', 'true');
      });
      // hidden / collapsed class patterns
      section.querySelectorAll('[hidden]').forEach(function(el) { el.removeAttribute('hidden'); });
      section.classList.remove('collapsed', 'closed', 'is-collapsed');
    });
  }
  lockOpen();
  // Block clicks on any expand/collapse trigger inside .observasjon so the
  // report's own toggle handlers can't run.
  document.addEventListener('click', function(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var section = t.closest('.observasjon');
    if (!section) return;
    var trigger = t.closest('summary, [data-toggle], [aria-expanded], button.toggle, .toggle');
    if (trigger) {
      e.preventDefault();
      e.stopImmediatePropagation();
      lockOpen();
    }
  }, true);
  // Re-apply on any toggle attempt
  document.addEventListener('toggle', function(e) {
    var d = e.target;
    if (d && d.closest && d.closest('.observasjon') && !d.open) d.open = true;
  }, true);
  // Re-apply if the DOM gets re-rendered
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(lockOpen).observe(document.body, { childList: true, subtree: true });
  }
})();
</script>
`;

export function HtmlContentViewer({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(800)
  // useId is stable across SSR and CSR — a module-level counter would have
  // produced different values on server vs client, causing the parent's uid
  // filter to reject the iframe's height messages on hydration.
  const uid = useId()

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
    // Inject scripts before </body> if present, otherwise append
    const scripts = OBSERVASJON_LOCK_SCRIPT + scriptTag
    if (result.includes('</body>')) {
      result = result.replace('</body>', scripts + '</body>')
    } else {
      result = result + scripts
    }
    return result
  }, [html, uid])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (
        !e.data ||
        e.data.type !== 'iframe-height' ||
        e.data.uid !== uid ||
        typeof e.data.height !== 'number' ||
        e.data.height <= 0
      ) {
        return
      }
      // Always honor the latest reported height. Add a small bottom margin
      // so the final line of content isn't flush against the iframe edge.
      setHeight(e.data.height + 16)
    }
    window.addEventListener('message', onMessage)

    // SSR refresh case: the iframe may finish loading and dispatch all its
    // periodic messages BEFORE React hydration runs this effect, so we'd
    // miss them. Poll a handshake to the iframe right after hydration; the
    // iframe's listener was set up at script-execution time so it's ready.
    // Retry a few times in case the iframe hasn't finished parsing yet.
    const requestHeight = () => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'iframe-request-height', uid },
        '*'
      )
    }
    requestHeight()
    const t1 = setTimeout(requestHeight, 100)
    const t2 = setTimeout(requestHeight, 500)
    const t3 = setTimeout(requestHeight, 1500)

    return () => {
      window.removeEventListener('message', onMessage)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [uid])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={augmentedHtml}
      onLoad={() => {
        // Handshake for the SSR refresh case: when the page is refreshed,
        // the iframe may finish loading before React hydration attaches the
        // parent message listener. Asking for the height here guarantees a
        // fresh report after the listener is in place.
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'iframe-request-height', uid },
          '*'
        )
      }}
      style={{
        width: '100%',
        height: `${height}px`,
        border: 'none',
        borderRadius: 12,
        transition: 'height 0.3s ease',
      }}
      scrolling="no"
      title="Rapport"
      sandbox="allow-same-origin allow-scripts allow-popups"
    />
  )
}
