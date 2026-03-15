import type { PortableTextBlock } from '@portabletext/react'

function renderBlock(block: PortableTextBlock): string {
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
}

// Simple portable text to HTML converter for email newsletters
export function portableTextToHtml(blocks: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      // Handle bydelSection custom blocks
      if (block._type === 'bydelSection') {
        const section = block as unknown as {
          bydel?: { name?: string; emoji?: string; slug?: string }
          content?: PortableTextBlock[]
        }
        const bydelName = section.bydel?.name || ''
        const bydelEmoji = section.bydel?.emoji || ''
        const bydelSlug = section.bydel?.slug || ''
        const innerHtml = section.content
          ? section.content.map(renderBlock).join('\n')
          : ''

        return `<div id="${bydelSlug}" style="border-left: 3px solid #D7B180; padding-left: 16px; margin: 24px 0;">
          <h2>${bydelEmoji} ${bydelName}</h2>
          ${innerHtml}
        </div>`
      }

      if (block._type !== 'block') return ''
      return renderBlock(block)
    })
    .join('\n')
}
