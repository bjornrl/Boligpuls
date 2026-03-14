import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PostWithBydel } from '@/types/index'
import { formatDate } from '@/lib/utils'
import BydelPill from '@/components/BydelPill'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  return {
    title: `${post.title} — Boligpuls Trondheim`,
    description: post.excerpt,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, bydeler(*)')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  const typedPost = post as unknown as PostWithBydel

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="max-w-[720px] mx-auto px-4 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium mb-8 transition-colors"
            style={{ color: '#5F7A7D' }}
          >
            &larr; Tilbake
          </Link>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <div className="h-1" style={{ backgroundColor: typedPost.bydeler.color }} />
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <BydelPill
                  name={typedPost.bydeler.name}
                  emoji={typedPost.bydeler.emoji}
                  color={typedPost.bydeler.color}
                  size="md"
                />
                {typedPost.published_at && (
                  <span className="text-sm" style={{ color: '#9BAFB2' }}>
                    {formatDate(typedPost.published_at)}
                  </span>
                )}
              </div>

              <h1
                className="text-3xl md:text-4xl mb-6"
                style={{
                  color: '#002D32',
                  fontFamily: '"Basel Classic", Georgia, serif',
                  letterSpacing: '-0.02em',
                }}
              >
                {typedPost.title}
              </h1>

              <div className="prose max-w-none" style={{ lineHeight: '1.85' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {typedPost.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
