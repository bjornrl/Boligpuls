import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import BydelPill from '@/components/BydelPill'

export const metadata = { title: 'Innlegg — Admin' }

export default async function AdminInnleggPage() {
  const supabase = createServerSupabaseClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, bydeler(*)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-3xl font-bold"
          style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
        >
          Innlegg
        </h1>
        <Link
          href="/admin/skriv"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: '#D4593A' }}
        >
          Nytt innlegg
        </Link>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDEBE8' }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#FAF9F6', borderBottom: '1px solid #EDEBE8' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#78716C' }}>Tittel</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#78716C' }}>Bydel</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#78716C' }}>Status</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#78716C' }}>Dato</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => {
              const bydel = post.bydeler as { name: string; color: string; emoji: string } | null
              return (
                <tr key={post.id} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #F5F3EF' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1C1917' }}>{post.title}</td>
                  <td className="px-4 py-3">
                    {bydel && <BydelPill name={bydel.name} emoji={bydel.emoji} color={bydel.color} />}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium"
                      style={{ color: post.is_published ? '#166534' : '#C4942E' }}
                    >
                      {post.is_published ? 'Publisert' : 'Utkast'}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#A8A29E' }}>
                    {formatDate(post.published_at || post.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/skriv/${post.id}`}
                      className="text-xs font-medium"
                      style={{ color: '#D4593A' }}
                    >
                      Rediger
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!posts || posts.length === 0) && (
          <p className="text-center py-8" style={{ color: '#A8A29E' }}>
            Ingen innlegg ennå.
          </p>
        )}
      </div>
    </div>
  )
}
