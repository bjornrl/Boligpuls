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
          className="text-3xl"
          style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
        >
          Innlegg
        </h1>
        <Link
          href="/admin/skriv"
          className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{ backgroundColor: '#D7B180', color: '#002D32' }}
        >
          Nytt innlegg
        </Link>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#F8F7F5', borderBottom: '1px solid #E8ECEE' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Tittel</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Bydel</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Status</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Dato</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => {
              const bydel = post.bydeler as { name: string; color: string; emoji: string } | null
              return (
                <tr key={post.id} style={{ borderBottom: '1px solid #E8ECEE' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F7F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: '#002D32' }}>{post.title}</td>
                  <td className="px-4 py-3">
                    {bydel && <BydelPill name={bydel.name} emoji={bydel.emoji} color={bydel.color} />}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={
                        post.is_published
                          ? { backgroundColor: '#DEE5E7', color: '#155356' }
                          : { backgroundColor: '#F3E9DB', color: '#B8860B' }
                      }
                    >
                      {post.is_published ? 'Publisert' : 'Utkast'}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#9BAFB2' }}>
                    {formatDate(post.published_at || post.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/skriv/${post.id}`}
                      className="text-xs font-medium"
                      style={{ color: '#155356' }}
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
          <p className="text-center py-8" style={{ color: '#9BAFB2' }}>
            Ingen innlegg ennå.
          </p>
        )}
      </div>
    </div>
  )
}
