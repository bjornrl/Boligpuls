import type { PortableTextBlock } from '@portabletext/react'

export type SanityBydel = {
  _id: string
  name: string
  slug: string
  emoji: string
  color: string
  description?: string
}

export type ReportType = 'ukentlig' | 'manedlig' | 'kvartal' | 'arsrapport'

export type ContentMode = 'portable-text' | 'html'
export type ContentFormat = 'html' | 'mjml'

export type SanityPost = {
  _id: string
  title: string
  slug: string
  excerpt: string
  contentMode?: ContentMode
  contentFormat?: ContentFormat
  htmlContent?: string
  content: PortableTextBlock[]
  reportType: ReportType
  reportPeriod?: string
  isNewsletter: boolean
  publishedAt: string
  seoTitle?: string
  seoDescription?: string
  bydeler?: SanityBydel[]
  bydel?: SanityBydel
}

export type SanityLocalReport = {
  _id: string
  title: string
  slug: string
  address: string
  location?: { lat: number; lng: number }
  excerpt?: string
  contentMode?: ContentMode
  htmlContent?: string
  content?: PortableTextBlock[]
  searchTerms?: string[]
  publishedAt: string
  seo?: { metaTitle?: string; metaDescription?: string }
}

export type SiteSettings = {
  heroTitle: string
  heroSubtitle: string
  aboutText?: string
  seoTitle?: string
  seoDescription?: string
}

export const reportTypeConfig: Record<ReportType, { label: string; emoji: string; color: string }> = {
  ukentlig: { label: 'Ukentlig', emoji: '📊', color: '#155356' },
  manedlig: { label: 'Månedlig', emoji: '📈', color: '#D7B180' },
  kvartal: { label: 'Kvartalsrapport', emoji: '📋', color: '#002D32' },
  arsrapport: { label: 'Årsrapport', emoji: '📑', color: '#7B5EA7' },
}
