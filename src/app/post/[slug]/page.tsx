import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/sanity/client'
import { postBySlugQuery } from '@/sanity/queries'
import type { SanityPost } from '@/sanity/types'
import { formatDate } from '@/lib/utils'
import BydelPill from '@/components/BydelPill'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await sanityClient.fetch<SanityPost | null>(postBySlugQuery, { slug: params.slug })

  if (!post) return { title: 'Artikkel ikke funnet' }
  return {
    title: `${post.seoTitle || post.title} — Boligpuls Trondheim`,
    description: post.seoDescription || post.excerpt,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await sanityClient.fetch<SanityPost | null>(postBySlugQuery, { slug: params.slug })

  if (!post) notFound()

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
            <div className="h-1" style={{ backgroundColor: post.bydel?.color || '#002D32' }} />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                {post.bydel && (
                  <BydelPill
                    name={post.bydel.name}
                    emoji={post.bydel.emoji}
                    color={post.bydel.color}
                    size="md"
                  />
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

              <div className="prose max-w-none" style={{ lineHeight: '1.85' }}>
                <PortableText value={post.content} />
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
