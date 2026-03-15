import { createServerSupabaseClient } from '@/lib/supabase/server'
import PostCard from '@/components/PostCard'
import { PostWithBydel } from '@/types/database'

export const metadata = { title: 'Artikler — Eiendom Trondheim' }
export const revalidate = 60

export default async function ArtiklerPage() {
  const supabase = createServerSupabaseClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, bydeler(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Alle artikler</h1>
      <p className="text-gray-600 mb-8">
        Siste nytt om boligmarkedet i Trondheim.
      </p>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(posts as PostWithBydel[]).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          Ingen artikler publisert ennå.
        </p>
      )}
    </div>
  )
}
