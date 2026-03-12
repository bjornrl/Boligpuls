import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Abonnenter — Admin' }

export default async function AdminSubscribersPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*, subscriber_bydeler(bydel_id, bydeler(name, color))')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Abonnenter</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">E-post</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Navn</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Frekvens</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Bydeler</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Registrert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers?.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{sub.email}</td>
                <td className="px-4 py-3 text-gray-600">{sub.name || '—'}</td>
                <td className="px-4 py-3 text-gray-600 capitalize">{sub.frequency === 'weekly' ? 'Ukentlig' : 'Månedlig'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(sub.subscriber_bydeler as { bydeler: { name: string; color: string } }[])?.map((sb, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: sb.bydeler?.color }}
                      >
                        {sb.bydeler?.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${sub.confirmed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {sub.confirmed ? 'Bekreftet' : 'Venter'}
                  </span>
                  {!sub.is_active && (
                    <span className="text-xs font-medium text-red-600 ml-1">Inaktiv</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(sub.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!subscribers || subscribers.length === 0) && (
          <p className="text-gray-500 text-center py-8">Ingen abonnenter ennå.</p>
        )}
      </div>
    </div>
  )
}
