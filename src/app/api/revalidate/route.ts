import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Verify webhook secret
  const secret = request.headers.get('x-sanity-webhook-secret')
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  const { _type, slug } = body

  // Revalidate based on content type
  revalidatePath('/')

  if (_type === 'post' && slug?.current) {
    revalidatePath(`/post/${slug.current}`)
  }

  if (_type === 'bydel' && slug?.current) {
    revalidatePath(`/bydeler/${slug.current}`)
  }

  if (_type === 'bydel') {
    revalidatePath('/bydeler')
  }

  return NextResponse.json({ revalidated: true })
}
