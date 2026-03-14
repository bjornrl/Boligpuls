import type { PortableTextBlock } from '@portabletext/react'

export type SanityBydel = {
  _id: string
  name: string
  slug: string
  emoji: string
  color: string
  description?: string
}

export type SanityPost = {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: PortableTextBlock[]
  isNewsletter: boolean
  publishedAt: string
  seoTitle?: string
  seoDescription?: string
  bydel: SanityBydel
}

export type SiteSettings = {
  heroTitle: string
  heroSubtitle: string
  aboutText?: string
  seoTitle?: string
  seoDescription?: string
}
