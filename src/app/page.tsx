'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostCard from '@/components/PostCard'
import BydelFilter from '@/components/BydelFilter'
import { Bydel, PostWithBydel } from '@/types/index'

export default function HomePage() {
  const [bydeler, setBydeler] = useState<Bydel[]>([])
  const [posts, setPosts] = useState<PostWithBydel[]>([])
  const [selectedBydel, setSelectedBydel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const bydelRes = await fetch('/api/bydeler')
      const bydelData = await bydelRes.json()
      setBydeler(bydelData)

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const postsRes = await fetch(
        `${supabaseUrl}/rest/v1/posts?select=*,bydeler(*)&is_published=eq.true&order=published_at.desc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      )
      const postsData = await postsRes.json()
      setPosts(postsData)
      setLoading(false)
    }
    load()
  }, [])

  const filteredPosts = selectedBydel
    ? posts.filter((p) => p.bydeler.slug === selectedBydel)
    : posts

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section
          className="py-20"
          style={{ backgroundColor: '#1C1917' }}
        >
          <div className="max-w-[1120px] mx-auto px-4 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '-0.02em' }}
            >
              Boligmarkedet i Trondheim
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#A8A29E' }}>
              Hold deg oppdatert på boligmarkedet i din bydel. Få ukentlige eller
              månedlige oppdateringer rett i innboksen.
            </p>
            <Link
              href="/nyhetsbrev"
              className="inline-block text-white px-8 py-3 rounded-xl text-base font-semibold transition-colors"
              style={{ backgroundColor: '#D4593A' }}
            >
              Abonner gratis
            </Link>
          </div>
        </section>

        {/* Filter + Posts */}
        <section className="max-w-[1120px] mx-auto px-4 py-12">
          <div className="mb-8">
            <BydelFilter
              bydeler={bydeler}
              selected={selectedBydel}
              onChange={setSelectedBydel}
            />
          </div>

          {loading ? (
            <div className="text-center py-12" style={{ color: '#A8A29E' }}>
              Laster artikler...
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: '#A8A29E' }}>
              Ingen artikler publisert ennå. Kom tilbake snart!
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
