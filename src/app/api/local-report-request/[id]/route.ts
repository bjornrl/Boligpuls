import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Ikke autorisert.' }, { status: 401 })
  }

  const body = await request.json()
  const { status } = body

  if (!['kontaktet', 'fullfort'].includes(status)) {
    return NextResponse.json(
      { error: 'Ugyldig status.' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('local_report_requests')
    .update({ status })
    .eq('id', params.id)

  if (error) {
    console.error('Failed to update local report request:', error)
    return NextResponse.json(
      { error: 'Kunne ikke oppdatere forespørselen.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
