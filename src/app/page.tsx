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
          className="py-20 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #002D32 0%, #155356 100%)' }}
        >
          {/* Decorative circles */}
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
              Boligmarkedet i Trondheim
            </h1>
            <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Hold deg oppdatert på boligmarkedet i din bydel. Få ukentlige eller
              månedlige oppdateringer rett i innboksen.
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
            <div className="text-center py-12" style={{ color: '#9BAFB2' }}>
              Laster artikler...
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
              Ingen artikler publisert ennå. Kom tilbake snart!
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
