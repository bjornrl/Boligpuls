import { notFound } from 'next/navigation'
import { sanityClient } from '@/sanity/client'
import { bydelBySlugQuery, postsByBydelQuery } from '@/sanity/queries'
import type { SanityPost, SanityBydel } from '@/sanity/types'
import PostCard from '@/components/PostCard'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const bydel = await sanityClient.fetch<SanityBydel | null>(bydelBySlugQuery, { slug: params.slug })

  if (!bydel) return { title: 'Bydel ikke funnet' }
  return { title: `${bydel.name} — Boligpuls Trondheim` }
}

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

export default async function BydelPage({ params }: { params: { slug: string } }) {
  const bydel = await sanityClient.fetch<SanityBydel | null>(bydelBySlugQuery, { slug: params.slug })

  if (!bydel) notFound()

  const posts = await sanityClient.fetch<SanityPost[]>(postsByBydelQuery, { slug: params.slug })
  const mappedPosts = (posts || []).map(mapPost)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bydel.color }} />
        <h1 className="text-3xl" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
          {bydel.name}
        </h1>
      </div>

      {mappedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
          Ingen artikler publisert for {bydel.name} ennå.
        </p>
      )}
    </div>
  )
}
