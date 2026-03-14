'use client'

import { useState } from 'react'
import PostCard from '@/components/PostCard'
import BydelFilter from '@/components/BydelFilter'
import { Bydel, PostWithBydel } from '@/types/index'

interface HomeContentProps {
  posts: PostWithBydel[]
  bydeler: Bydel[]
}

export default function HomeContent({ posts, bydeler }: HomeContentProps) {
  const [selectedBydel, setSelectedBydel] = useState<string | null>(null)

  const filteredPosts = selectedBydel
    ? posts.filter((p) => p.bydeler.slug === selectedBydel)
    : posts

  return (
    <section className="max-w-[1120px] mx-auto px-4 py-12">
      <div className="mb-8">
        <BydelFilter
          bydeler={bydeler}
          selected={selectedBydel}
          onChange={setSelectedBydel}
        />
      </div>

      {filteredPosts.length > 0 ? (
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
  )
}
