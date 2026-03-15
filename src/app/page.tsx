import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomeContent from '@/components/HomeContent'
import { sanityClient } from '@/sanity/client'
import { allPostsQuery, siteSettingsQuery } from '@/sanity/queries'
import type { SanityPost, SiteSettings } from '@/sanity/types'

export const revalidate = 60

export default async function HomePage() {
  const [posts, settings] = await Promise.all([
    sanityClient.fetch<SanityPost[]>(allPostsQuery),
    sanityClient.fetch<SiteSettings | null>(siteSettingsQuery),
  ])

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
              {settings?.heroSubtitle || 'Ukentlige og månedlige rapporter om boligmarkedet — pluss kvartals- og årsrapporter rett i innboksen.'}
            </p>
            <div className="flex items-center justify-center gap-2 mb-8" style={{ color: 'rgba(215,177,128,0.7)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              <span className="text-sm">Markedsrapporter for Trondheim</span>
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

        <HomeContent posts={posts || []} />
      </main>
      <Footer />
    </>
  )
}
