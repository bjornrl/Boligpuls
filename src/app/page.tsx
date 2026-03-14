import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomeContent from '@/components/HomeContent'
import { sanityClient } from '@/sanity/client'
import { allPostsQuery, allBydelerQuery, siteSettingsQuery } from '@/sanity/queries'
import type { SanityPost, SanityBydel, SiteSettings } from '@/sanity/types'

export const revalidate = 60

// Map Sanity data to the shape our components expect
function mapPost(p: SanityPost) {
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: '',
    bydel_id: p.bydel?._id || '',
    is_newsletter: p.isNewsletter,
    is_published: true,
    published_at: p.publishedAt,
    author_id: null,
    created_at: p.publishedAt,
    updated_at: p.publishedAt,
    bydeler: {
      id: p.bydel?._id || '',
      slug: p.bydel?.slug || '',
      name: p.bydel?.name || '',
      color: p.bydel?.color || '#002D32',
      emoji: p.bydel?.emoji || '',
      created_at: '',
    },
  }
}

function mapBydel(b: SanityBydel) {
  return {
    id: b._id,
    slug: b.slug,
    name: b.name,
    color: b.color,
    emoji: b.emoji || '',
    created_at: '',
  }
}

export default async function HomePage() {
  const [posts, bydeler, settings] = await Promise.all([
    sanityClient.fetch<SanityPost[]>(allPostsQuery),
    sanityClient.fetch<SanityBydel[]>(allBydelerQuery),
    sanityClient.fetch<SiteSettings | null>(siteSettingsQuery),
  ])

  const mappedPosts = (posts || []).map(mapPost)
  const mappedBydeler = (bydeler || []).map(mapBydel)

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="py-20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #002D32 0%, #155356 100%)' }}
        >
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
            style={{ backgroundColor: 'rgba(215,177,128,0.08)' }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full"
            style={{ backgroundColor: 'rgba(215,177,128,0.06)' }}
          />
          <div className="max-w-[1120px] mx-auto px-4 text-center relative z-10">
            <h1
              className="text-4xl md:text-5xl text-white mb-4"
              style={{ fontFamily: '"Basel Classic", Georgia, serif', letterSpacing: '-0.02em' }}
            >
              {settings?.heroTitle || 'Boligmarkedet i Trondheim'}
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {settings?.heroSubtitle || 'Hold deg oppdatert på boligmarkedet i din bydel. Få ukentlige eller månedlige oppdateringer rett i innboksen.'}
            </p>
            <div className="flex items-center justify-center gap-2 mb-8" style={{ color: 'rgba(215,177,128,0.7)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span className="text-sm">Markedsoppdateringer for Trondheim</span>
            </div>
            <Link
              href="/nyhetsbrev"
              className="inline-block px-8 py-3 rounded-xl text-base font-medium transition-colors"
              style={{ backgroundColor: '#D7B180', color: '#002D32' }}
            >
              Abonner gratis
            </Link>
          </div>
        </section>

        {/* Filter + Posts (client-side filtering) */}
        <HomeContent posts={mappedPosts} bydeler={mappedBydeler} />
      </main>
      <Footer />
    </>
  )
}
