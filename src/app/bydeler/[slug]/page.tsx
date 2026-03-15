import { notFound } from 'next/navigation'
import { sanityClient } from '@/sanity/client'
import { bydelBySlugQuery, allPostsQuery } from '@/sanity/queries'
import type { SanityPost, SanityBydel } from '@/sanity/types'
import PostCard from '@/components/PostCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const bydel = await sanityClient.fetch<SanityBydel | null>(bydelBySlugQuery, { slug: params.slug })

  if (!bydel) return { title: 'Bydel ikke funnet' }
  return { title: `${bydel.name} — Eiendom Trondheim` }
}

export default async function BydelPage({ params }: { params: { slug: string } }) {
  const bydel = await sanityClient.fetch<SanityBydel | null>(bydelBySlugQuery, { slug: params.slug })

  if (!bydel) notFound()

  // Get posts that mention this bydel
  const allPosts = await sanityClient.fetch<SanityPost[]>(allPostsQuery)
  const posts = (allPosts || []).filter((p) =>
    p.bydeler?.some((b) => b.slug === params.slug)
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-[1120px] mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bydel.color }} />
            <h1 className="text-3xl" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
              {bydel.name}
            </h1>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
              Ingen rapporter om {bydel.name} ennå.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
