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

export type SanityPost = {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: PortableTextBlock[]
  reportType: ReportType
  reportPeriod?: string
  isNewsletter: boolean
  publishedAt: string
  seoTitle?: string
  seoDescription?: string
  bydeler?: SanityBydel[]
  // Deprecated
  bydel?: SanityBydel
}

export type SiteSettings = {
  heroTitle: string
  heroSubtitle: string
  aboutText?: string
  seoTitle?: string
  seoDescription?: string
}

export const reportTypeConfig: Record<ReportType, { label: string; emoji: string; color: string }> = {
  ukentlig: { label: 'Ukesrapport', emoji: '📊', color: '#155356' },
  manedlig: { label: 'Månedsrapport', emoji: '📈', color: '#155356' },
  kvartal: { label: 'Kvartalsrapport', emoji: '📋', color: '#155356' },
  arsrapport: { label: 'Årsrapport', emoji: '📑', color: '#155356' },
}
