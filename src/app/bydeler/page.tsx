import { createServerSupabaseClient } from '@/lib/supabase/server'
import BydelerGrid from '@/components/BydelerGrid'

export const metadata = { title: 'Bydeler — Boligpuls Trondheim' }

export default async function BydelerPage() {
  const supabase = createServerSupabaseClient()
  const { data: bydeler } = await supabase.from('bydeler').select('*').order('name')

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
        Bydeler i Trondheim
      </h1>
      <p className="mb-8" style={{ color: '#5F7A7D' }}>
        Velg en bydel for å se artikler og oppdateringer om boligmarkedet.
      </p>
      {bydeler && <BydelerGrid bydeler={bydeler} />}
    </div>
  )
}
