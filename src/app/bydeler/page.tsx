import { createServerSupabaseClient } from '@/lib/supabase/server'
import BydelerGrid from '@/components/BydelerGrid'

export const metadata = { title: 'Bydeler — Boligpuls Trondheim' }

export default async function BydelerPage() {
  const supabase = createServerSupabaseClient()
  const { data: bydeler } = await supabase.from('bydeler').select('*').order('name')

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Bydeler i Trondheim</h1>
      <p className="text-gray-600 mb-8">
        Velg en bydel for å se artikler og oppdateringer om boligmarkedet.
      </p>
      {bydeler && <BydelerGrid bydeler={bydeler} />}
    </div>
  )
}
