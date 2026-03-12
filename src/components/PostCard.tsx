import Link from 'next/link'
import { PostWithBydel } from '@/types/index'
import { formatDate } from '@/lib/utils'
import BydelPill from './BydelPill'

export default function PostCard({ post }: { post: PostWithBydel }) {
  return (
    <article
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #EDEBE8',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="h-1" style={{ backgroundColor: post.bydeler.color }} />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <BydelPill name={post.bydeler.name} emoji={post.bydeler.emoji} color={post.bydeler.color} />
          {post.published_at && (
            <span className="text-sm ml-auto" style={{ color: '#A8A29E' }}>
              {formatDate(post.published_at)}
            </span>
          )}
        </div>
        {post.is_newsletter && (
          <span
            className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded mb-2"
            style={{ backgroundColor: '#D4593A', color: '#FFFFFF' }}
          >
            Nyhetsbrev
          </span>
        )}
        <Link href={`/post/${post.slug}`}>
          <h3
            className="text-lg font-bold mb-2 transition-colors"
            style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
          >
            {post.title}
          </h3>
        </Link>
        <p className="text-sm line-clamp-3 mb-4" style={{ color: '#78716C' }}>
          {post.excerpt}
        </p>
        <Link
          href={`/post/${post.slug}`}
          className="inline-block text-sm font-medium transition-colors"
          style={{ color: '#D4593A' }}
        >
          Les mer &rarr;
        </Link>
      </div>
    </article>
  )
}
