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
        border: '1px solid #E8ECEE',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,45,50,0.08)'
        e.currentTarget.style.borderColor = post.bydeler.color
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.borderColor = '#E8ECEE'
      }}
    >
      <div className="h-[3px]" style={{ backgroundColor: post.bydeler.color }} />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <BydelPill name={post.bydeler.name} emoji={post.bydeler.emoji} color={post.bydeler.color} />
          {post.published_at && (
            <span className="text-sm ml-auto" style={{ color: '#9BAFB2' }}>
              {formatDate(post.published_at)}
            </span>
          )}
        </div>
        {post.is_newsletter && (
          <span
            className="inline-block text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded mb-2"
            style={{ backgroundColor: '#F3E9DB', color: '#B8860B', letterSpacing: '0.02em' }}
          >
            Nyhetsbrev
          </span>
        )}
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
          className="inline-block text-sm font-medium transition-colors"
          style={{ color: post.bydeler.color }}
        >
          Les mer &rarr;
        </Link>
      </div>
    </article>
  )
}
