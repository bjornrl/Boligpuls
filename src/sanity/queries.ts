import { groq } from 'next-sanity'

// All published posts
export const allPostsQuery = groq`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    contentMode,
    contentFormat,
    htmlContent,
    reportType,
    reportPeriod,
    isNewsletter,
    publishedAt,
    seoTitle,
    seoDescription,
    "bydeler": bydeler[]->{ _id, name, "slug": slug.current, emoji, color }
  }
`

// Single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && defined(publishedAt)][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    contentMode,
    contentFormat,
    htmlContent,
    reportType,
    reportPeriod,
    isNewsletter,
    publishedAt,
    seoTitle,
    seoDescription,
    "bydeler": bydeler[]->{ _id, name, "slug": slug.current, emoji, color }
  }
`

// Single post by ID (for newsletter sending)
export const postByIdQuery = groq`
  *[_type == "post" && _id == $id][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    contentMode,
    contentFormat,
    htmlContent,
    reportType,
    reportPeriod,
    isNewsletter,
    publishedAt,
    "bydeler": bydeler[]->{ _id, name, "slug": slug.current, emoji, color }
  }
`

// All bydeler
export const allBydelerQuery = groq`
  *[_type == "bydel"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    emoji,
    color,
    description
  }
`

// Bydel by slug
export const bydelBySlugQuery = groq`
  *[_type == "bydel" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    emoji,
    color,
    description
  }
`

// Site settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroTitle,
    heroSubtitle,
    aboutText,
    seoTitle,
    seoDescription
  }
`
