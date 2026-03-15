import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PostWithBydel } from '@/types/database'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) return { title: 'Artikkel ikke funnet' }
  return { title: `${post.title} — EIENDOM Trondheim`, description: post.excerpt }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, bydeler(*)')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  const typedPost = post as PostWithBydel

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: typedPost.bydeler.color }}
          />
          <Link
            href={`/bydeler/${typedPost.bydeler.slug}`}
            className="text-sm font-medium hover:underline"
            style={{ color: typedPost.bydeler.color }}
          >
            {typedPost.bydeler.name}
          </Link>
          {typedPost.published_at && (
            <span className="text-gray-400 text-sm ml-2">
              {formatDate(typedPost.published_at)}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {typedPost.title}
        </h1>
        <p className="text-lg text-gray-600">{typedPost.excerpt}</p>
      </div>

      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {typedPost.content}
        </ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/abonner"
          className="inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          Abonner for å få flere artikler &rarr;
        </Link>
      </div>
    </article>
  )
}
