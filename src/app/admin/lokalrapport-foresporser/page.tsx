import { createServerSupabaseClient } from '@/lib/supabase/server'
import LocalReportRequestsTable from '@/components/LocalReportRequestsTable'
import type { LocalReportRequest } from '@/types/index'

export const metadata = { title: 'Lokalrapport-forespørsler — Admin' }

export default async function AdminLokalrapportForesporserPage() {
  const supabase = createServerSupabaseClient()

  const { data: requests } = await supabase
    .from('local_report_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
      >
        Lokalrapport-forespørsler
      </h1>
      <LocalReportRequestsTable
        requests={(requests || []) as unknown as LocalReportRequest[]}
      />
    </div>
  )
}
