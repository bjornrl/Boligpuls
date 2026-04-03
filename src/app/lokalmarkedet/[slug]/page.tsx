import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/sanity/client'
import { localReportBySlugQuery } from '@/sanity/queries'
import type { SanityLocalReport } from '@/sanity/types'
import { formatDate } from '@/lib/utils'
import { ensureMobileCompatible } from '@/lib/html-mobile-fix'
import { SanitizedNewsletterHtml } from '@/components/SanitizedNewsletterHtml'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const LocalReportMiniMap = dynamic(() => import('./LocalReportMiniMap'), {
  ssr: false,
  loading: () => (
    <div
      style={{ width: '100%', height: 240, borderRadius: 12, backgroundColor: '#F5F3EF', border: '1px solid #EDEBE8' }}
    />
  ),
})

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const report = await sanityClient.fetch<SanityLocalReport | null>(localReportBySlugQuery, {
    slug: params.slug,
  })

  if (!report) return { title: 'Rapport ikke funnet' }
  return {
    title: `${report.seo?.metaTitle || report.title} — Eiendom Trondheim`,
    description: report.seo?.metaDescription || report.excerpt,
  }
}

export default async function LocalReportPage({ params }: { params: { slug: string } }) {
  const report = await sanityClient.fetch<SanityLocalReport | null>(localReportBySlugQuery, {
    slug: params.slug,
  })

  if (!report) notFound()

  let displayHtml: string | undefined
  if (report.contentMode === 'html' && report.htmlContent) {
    displayHtml = ensureMobileCompatible(report.htmlContent)
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-[720px] mx-auto px-4 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium mb-8 transition-colors"
            style={{ color: '#5F7A7D' }}
          >
            &larr; Tilbake til forsiden
          </Link>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <div className="h-1" style={{ backgroundColor: '#D7B180' }} />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full"
                  style={{ backgroundColor: '#D7B18015', color: '#B8860B', border: '1px solid #D7B18030' }}
                >
                  Lokalrapport
                </span>
                {report.publishedAt && (
                  <span className="text-sm" style={{ color: '#9BAFB2' }}>
                    {formatDate(report.publishedAt)}
                  </span>
                )}
              </div>

              <h1
                className="text-3xl md:text-4xl mb-2"
                style={{
                  color: '#002D32',
                  fontFamily: '"Basel Classic", Georgia, serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {report.title}
              </h1>

              <p className="text-sm mb-6" style={{ color: '#78716C' }}>
                {report.address}
              </p>

              {/* Mini map */}
              {report.location?.lat && report.location?.lng && (
                <div className="mb-8">
                  <LocalReportMiniMap
                    lat={report.location.lat}
                    lng={report.location.lng}
                    title={report.title}
                  />
                </div>
              )}

              {/* Content */}
              {displayHtml ? (
                <SanitizedNewsletterHtml html={displayHtml} />
              ) : report.content ? (
                <div className="prose max-w-none" style={{ lineHeight: '1.85' }}>
                  <PortableText value={report.content} />
                </div>
              ) : report.excerpt ? (
                <p style={{ color: '#44403C', lineHeight: '1.85', fontSize: 16 }}>{report.excerpt}</p>
              ) : null}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
