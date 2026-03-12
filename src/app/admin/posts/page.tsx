import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Artikler — Admin' }

export default async function AdminPostsPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('*, bydeler(name, color)')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Artikler</h1>
        <Link
          href="/admin/posts/new"
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600"
        >
          Ny artikkel
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Tittel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Bydel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Opprettet</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{post.title}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: (post.bydeler as { color: string })?.color }}
                  >
                    {(post.bydeler as { name: string })?.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${post.is_published ? 'text-green-600' : 'text-yellow-600'}`}>
                    {post.is_published ? 'Publisert' : 'Utkast'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(post.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-red-500 hover:text-red-600 text-xs font-medium"
                  >
                    Rediger
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!posts || posts.length === 0) && (
          <p className="text-gray-500 text-center py-8">Ingen artikler ennå.</p>
        )}
      </div>
    </div>
  )
}
