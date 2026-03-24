import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/sanity/client'
import { postBySlugQuery } from '@/sanity/queries'
import type { SanityPost } from '@/sanity/types'
import { reportTypeConfig } from '@/sanity/types'
import { formatDate } from '@/lib/utils'
import { sanitizeNewsletter } from '@/lib/sanitize'
import ReportTypeBadge from '@/components/ReportTypeBadge'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await sanityClient.fetch<SanityPost | null>(postBySlugQuery, { slug: params.slug })

  if (!post) return { title: 'Artikkel ikke funnet' }
  return {
    title: `${post.seoTitle || post.title} — Eiendom Trondheim`,
    description: post.seoDescription || post.excerpt,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await sanityClient.fetch<SanityPost | null>(postBySlugQuery, { slug: params.slug })

  if (!post) notFound()

  const config = reportTypeConfig[post.reportType]

  // Extract bydel sections from content for table of contents
  const bydelSections = (post.content || [])
    .filter((block) => block._type === 'bydelSection')
    .map((block) => {
      const section = block as unknown as {
        bydel?: { name?: string; emoji?: string; slug?: string }
      }
      return {
        name: section.bydel?.name || '',
        emoji: section.bydel?.emoji || '',
        slug: section.bydel?.slug || '',
      }
    })
    .filter((s) => s.slug)

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
            &larr; Tilbake
          </Link>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <div className="h-1" style={{ backgroundColor: config?.color || '#002D32' }} />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <ReportTypeBadge type={post.reportType} size="md" />
                {post.reportPeriod && (
                  <span className="text-sm" style={{ color: '#5F7A7D' }}>
                    {post.reportPeriod}
                  </span>
                )}
                {post.publishedAt && (
                  <span className="text-sm" style={{ color: '#9BAFB2' }}>
                    {formatDate(post.publishedAt)}
                  </span>
                )}
              </div>

              <h1
                className="text-3xl md:text-4xl mb-6"
                style={{
                  color: '#002D32',
                  fontFamily: '"Basel Classic", Georgia, serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {post.title}
              </h1>

              {bydelSections.length > 0 && (
                <div
                  className="rounded-xl p-4 mb-8"
                  style={{ backgroundColor: '#F8F7F5', border: '1px solid #E8ECEE' }}
                >
                  <p className="text-sm font-medium mb-2" style={{ color: '#002D32' }}>
                    Hopp til bydel:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bydelSections.map((s) => (
                      <a
                        key={s.slug}
                        href={`#${s.slug}`}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                        style={{ backgroundColor: '#DEE5E7', color: '#155356' }}
                      >
                        {s.emoji} {s.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {post.contentMode === 'html' && post.htmlContent ? (
                <iframe
                  srcDoc={sanitizeNewsletter(post.htmlContent)}
                  style={{ width: '100%', minHeight: '80vh', border: 'none' }}
                  title={post.title}
                  sandbox="allow-same-origin allow-popups"
                />
              ) : (
                <div className="prose max-w-none" style={{ lineHeight: '1.85' }}>
                  <PortableText value={post.content} />
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
