import { sanityClient } from '@/sanity/client'
import { allPostsQuery } from '@/sanity/queries'
import type { SanityPost } from '@/sanity/types'
import PostCard from '@/components/PostCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = { title: 'Artikler — Eiendom Trondheim' }
export const revalidate = 60

export default async function ArtiklerPage() {
  const posts = await sanityClient.fetch<SanityPost[]>(allPostsQuery)

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-[1120px] mx-auto px-4 py-12">
          <h1
            className="text-3xl mb-2"
            style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
          >
            Alle rapporter
          </h1>
          <p className="mb-8" style={{ color: '#5F7A7D' }}>
            Siste nytt om boligmarkedet i Trondheim.
          </p>

          {posts && posts.length > 0 ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
              Ingen rapporter publisert ennå.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
