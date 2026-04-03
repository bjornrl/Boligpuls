/**
 * Automatisk fix av HTML for mobil-kompatibilitet.
 * Kjøres server-side før HTML sendes som e-post eller rendres på nettsiden.
 * Idempotent — trygg å kjøre på allerede mobilvenlig HTML.
 */
export function ensureMobileCompatible(html: string): string {
  let fixed = html

  // 1. Sørg for at viewport meta-tag finnes
  if (!fixed.includes('name="viewport"') && !fixed.includes("name='viewport'")) {
    if (fixed.includes('<head>')) {
      fixed = fixed.replace(
        '<head>',
        '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      )
    } else if (fixed.includes('<body')) {
      fixed = fixed.replace(
        '<body',
        '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body'
      )
    }
  }

  // 2. Sørg for at charset er satt
  if (!fixed.includes('charset=')) {
    if (fixed.includes('<head>')) {
      fixed = fixed.replace('<head>', '<head>\n<meta charset="utf-8">')
    }
  }

  // 3. Fiks bilder som mangler responsive styling
  fixed = fixed.replace(
    /<img\s+([^>]*?)>/gi,
    (_match, attrs: string) => {
      if (attrs.includes('max-width')) return `<img ${attrs}>`

      let newAttrs = attrs
      if (newAttrs.includes('style="')) {
        newAttrs = newAttrs.replace(
          /style="([^"]*)"/,
          'style="$1; max-width: 100%; height: auto;"'
        )
      } else if (newAttrs.includes("style='")) {
        newAttrs = newAttrs.replace(
          /style='([^']*)'/,
          "style='$1; max-width: 100%; height: auto;'"
        )
      } else {
        newAttrs += ' style="max-width: 100%; height: auto;"'
      }

      return `<img ${newAttrs}>`
    }
  )

  // 4. Fiks tabeller som er for brede
  fixed = fixed.replace(
    /<table\s+([^>]*?)>/gi,
    (_match, attrs: string) => {
      if (attrs.includes('max-width')) return `<table ${attrs}>`

      let newAttrs = attrs
      if (newAttrs.includes('style="')) {
        newAttrs = newAttrs.replace(
          /style="([^"]*)"/,
          'style="$1; max-width: 100%; width: 100%;"'
        )
      } else if (newAttrs.includes("style='")) {
        newAttrs = newAttrs.replace(
          /style='([^']*)'/,
          "style='$1; max-width: 100%; width: 100%;'"
        )
      } else {
        newAttrs += ' style="max-width: 100%; width: 100%;"'
      }

      return `<table ${newAttrs}>`
    }
  )

  // 5. Sørg for at body ikke har overflow
  if (fixed.includes('<body')) {
    fixed = fixed.replace(
      /<body(\s+[^>]*?)?\s*>/gi,
      (match, attrs?: string) => {
        if (!attrs) return '<body style="overflow-x: hidden; -webkit-text-size-adjust: 100%;">'
        if (attrs.includes('overflow-x')) return match
        if (attrs.includes('style="')) {
          return match.replace(
            /style="([^"]*)"/,
            'style="$1; overflow-x: hidden; -webkit-text-size-adjust: 100%;"'
          )
        }
        return match.replace('<body', '<body style="overflow-x: hidden; -webkit-text-size-adjust: 100%;"')
      }
    )
  }

  // 6. Fiks hardkodede bredder over 600px (HTML-attributter)
  fixed = fixed.replace(
    /width="(\d+)"/gi,
    (match, width: string) => {
      return parseInt(width) > 600 ? 'width="100%"' : match
    }
  )

  // 6b. Fiks hardkodede bredder i inline CSS (f.eks. width: 600px)
  fixed = fixed.replace(
    /width:\s*(\d+)px/gi,
    (match, width: string) => {
      return parseInt(width) > 600 ? 'width: 100%' : match
    }
  )

  // 7. Legg til responsive media queries i <head>
  const responsiveStyle = `
    <style type="text/css">
      @media only screen and (max-width: 620px) {
        table[class="email-container"] { width: 100% !important; }
        td[class="stack-column"] { display: block !important; width: 100% !important; }
        img { max-width: 100% !important; height: auto !important; }
        td { padding-left: 16px !important; padding-right: 16px !important; }
        h1 { font-size: 24px !important; }
        h2 { font-size: 20px !important; }
      }
    </style>
  `

  if (fixed.includes('</head>') && !fixed.includes('@media only screen')) {
    fixed = fixed.replace('</head>', responsiveStyle + '\n</head>')
  }

  return fixed
}
