'use client'

import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ReportTypeBadge from './ReportTypeBadge'
import type { SanityPost } from '@/sanity/types'

export default function PostCard({ post }: { post: SanityPost }) {
  const accentColor = '#155356'

  return (
    <article
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8ECEE',
      }}
    >
      <div className="h-[3px]" style={{ backgroundColor: accentColor }} />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <ReportTypeBadge type={post.reportType} color={accentColor} />
          {post.reportPeriod && (
            <span className="text-xs" style={{ color: '#9BAFB2' }}>
              {post.reportPeriod}
            </span>
          )}
          {post.publishedAt && (
            <span className="text-sm ml-auto" style={{ color: '#9BAFB2' }}>
              {formatDate(post.publishedAt)}
            </span>
          )}
        </div>
        <Link href={`/post/${post.slug}`}>
          <h3
            className="text-lg mb-2 transition-colors"
            style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif', letterSpacing: '-0.01em' }}
          >
            {post.title}
          </h3>
        </Link>
        <p className="text-sm line-clamp-3 mb-4" style={{ color: '#5F7A7D' }}>
          {post.excerpt}
        </p>
        <Link
          href={`/post/${post.slug}`}
          className="link-arrow inline-block text-sm font-medium opacity-90 hover:opacity-100"
          style={{ color: accentColor }}
        >
          Les mer &rarr;
        </Link>
      </div>
    </article>
  )
}
