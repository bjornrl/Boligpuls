import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/client'
import { allBydelerQuery } from '@/sanity/queries'

export async function GET() {
  try {
    const bydeler = await sanityClient.fetch(allBydelerQuery)

    // Map to the shape components expect (id, slug as string, etc.)
    const mapped = bydeler.map((b: { _id: string; slug: string; name: string; color: string; emoji: string }) => ({
      id: b._id,
      slug: b.slug,
      name: b.name,
      color: b.color,
      emoji: b.emoji || '',
      created_at: new Date().toISOString(),
    }))

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('Failed to fetch bydeler from Sanity:', error)
    return NextResponse.json({ error: 'Failed to fetch bydeler' }, { status: 500 })
  }
}
