import Link from 'next/link'
import { PostWithBydel } from '@/types/database'
import { formatDate } from '@/lib/utils'

export default function PostCard({ post }: { post: PostWithBydel }) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: post.bydeler.color }}
          />
          <Link
            href={`/bydeler/${post.bydeler.slug}`}
            className="text-sm font-medium hover:underline"
            style={{ color: post.bydeler.color }}
          >
            {post.bydeler.name}
          </Link>
          {post.published_at && (
            <span className="text-gray-400 text-sm ml-auto">
              {formatDate(post.published_at)}
            </span>
          )}
        </div>
        <Link href={`/artikler/${post.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-red-500 transition-colors mb-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
        <Link
          href={`/artikler/${post.slug}`}
          className="inline-block mt-4 text-red-500 text-sm font-medium hover:text-red-600"
        >
          Les mer &rarr;
        </Link>
      </div>
    </article>
  )
}
