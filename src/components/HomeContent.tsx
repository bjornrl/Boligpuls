'use client'

import { useState } from 'react'
import PostCard from '@/components/PostCard'
import ReportTypeFilter from '@/components/ReportTypeFilter'
import type { SanityPost, ReportType } from '@/sanity/types'

interface HomeContentProps {
  posts: SanityPost[]
}

export default function HomeContent({ posts }: HomeContentProps) {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null)

  const filteredPosts = selectedType
    ? posts.filter((p) => p.reportType === selectedType)
    : posts

  return (
    <section className="max-w-[1120px] mx-auto px-4 py-12">
      <div className="mb-8">
        <ReportTypeFilter selected={selectedType} onChange={setSelectedType} />
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
          Ingen rapporter funnet.
        </p>
      )}
    </section>
  )
}
