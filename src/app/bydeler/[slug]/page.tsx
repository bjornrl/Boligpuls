import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import { PostWithBydel } from '@/types/database'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: bydel } = await supabase
    .from('bydeler')
    .select('name')
    .eq('slug', params.slug)
    .single()

  if (!bydel) return { title: 'Bydel ikke funnet' }
  return { title: `${bydel.name} — Boligpuls Trondheim` }
}

export default async function BydelPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient()

  const { data: bydel } = await supabase
    .from('bydeler')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!bydel) notFound()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, bydeler(*)')
    .eq('bydel_id', bydel.id)
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: bydel.color }} />
        <h1 className="text-3xl" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
          {bydel.name}
        </h1>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(posts as PostWithBydel[]).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
          Ingen artikler publisert for {bydel.name} ennå.
        </p>
      )}
    </div>
  )
}
