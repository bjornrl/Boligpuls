import type { PortableTextBlock } from '@portabletext/react'

// Simple portable text to HTML converter for email newsletters
export function portableTextToHtml(blocks: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      if (block._type !== 'block') return ''

      const children = (block.children as { _type: string; text: string; marks?: string[] }[]) || []
      const text = children
        .map((child) => {
          let t = child.text || ''
          if (child.marks?.includes('strong')) t = `<strong>${t}</strong>`
          if (child.marks?.includes('em')) t = `<em>${t}</em>`
          return t
        })
        .join('')

      switch (block.style) {
        case 'h2':
          return `<h2>${text}</h2>`
        case 'h3':
          return `<h3>${text}</h3>`
        case 'blockquote':
          return `<blockquote>${text}</blockquote>`
        default:
          return `<p>${text}</p>`
      }
    })
    .join('\n')
}
