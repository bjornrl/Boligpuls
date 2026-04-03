import sanitizeHtml from 'sanitize-html'

export function sanitizeNewsletter(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'div', 'span', 'table', 'tr', 'td', 'th', 'thead',
      'tbody', 'tfoot', 'caption', 'colgroup', 'col', 'h1', 'h2', 'h3',
      'h4', 'h5', 'h6', 'p', 'br', 'hr', 'a', 'strong', 'em', 'b', 'i',
      'u', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'center',
      'section', 'article', 'header', 'footer', 'nav', 'figure',
      'figcaption', 'main',
    ]),
    allowedAttributes: {
      '*': ['style', 'class', 'id', 'width', 'height', 'align', 'valign',
            'bgcolor', 'color', 'border', 'cellpadding', 'cellspacing'],
      'a': ['href', 'target', 'rel'],
      'img': ['src', 'alt', 'width', 'height'],
      'td': ['colspan', 'rowspan'],
      'th': ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowVulnerableTags: false,
  })
}
