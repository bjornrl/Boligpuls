import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Admin — Boligpuls Trondheim' }

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const [
    { count: postCount },
    { count: subscriberCount },
    { count: sendCount },
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true),
    supabase.from('newsletter_sends').select('*', { count: 'exact', head: true }).eq('status', 'sent'),
  ])

  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*, bydeler(name, color)')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600"
        >
          Ny artikkel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Artikler</p>
          <p className="text-3xl font-bold text-gray-900">{postCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Bekreftede abonnenter</p>
          <p className="text-3xl font-bold text-gray-900">{subscriberCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">E-poster sendt</p>
          <p className="text-3xl font-bold text-gray-900">{sendCount || 0}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Link href="/admin/posts" className="text-red-500 font-medium hover:text-red-600">
          Alle artikler &rarr;
        </Link>
        <Link href="/admin/subscribers" className="text-red-500 font-medium hover:text-red-600">
          Abonnenter &rarr;
        </Link>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Siste artikler</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Tittel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Bydel</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentPosts?.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{post.title}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full text-white"
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
      </div>
    </div>
  )
}
