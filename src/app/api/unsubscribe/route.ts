import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/nyhetsbrev/avmeldt', request.url))
  }

  const supabase = createAdminClient()

  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('id')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (subscriber) {
    await supabase
      .from('subscribers')
      .update({ is_active: false })
      .eq('id', subscriber.id)
  }

  return NextResponse.redirect(new URL('/nyhetsbrev/avmeldt', request.url))
}
