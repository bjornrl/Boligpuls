import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import BydelerGrid from '@/components/BydelerGrid'
import PostCard from '@/components/PostCard'
import { PostWithBydel } from '@/types/database'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  const { data: bydeler } = await supabase
    .from('bydeler')
    .select('*')
    .order('name')

  const { data: posts } = await supabase
    .from('posts')
    .select('*, bydeler(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Boligpuls Trondheim
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Hold deg oppdatert på boligmarkedet i din bydel. Få ukentlige eller
            månedlige oppdateringer rett i innboksen.
          </p>
          <Link
            href="/abonner"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-600 transition-colors"
          >
            Abonner gratis
          </Link>
        </div>
      </section>

      {/* Bydeler */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Utforsk bydeler</h2>
        {bydeler && <BydelerGrid bydeler={bydeler} />}
      </section>

      {/* Siste artikler */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Siste artikler</h2>
          <Link href="/artikler" className="text-red-500 text-sm font-medium hover:text-red-600">
            Se alle &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(posts as PostWithBydel[] | null)?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {(!posts || posts.length === 0) && (
          <p className="text-gray-500 text-center py-12">
            Ingen artikler publisert ennå. Kom tilbake snart!
          </p>
        )}
      </section>
    </div>
  )
}
