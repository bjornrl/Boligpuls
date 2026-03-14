import { sanityClient } from '@/sanity/client'
import { allBydelerQuery } from '@/sanity/queries'
import type { SanityBydel } from '@/sanity/types'
import BydelerGrid from '@/components/BydelerGrid'

export const revalidate = 60

export const metadata = { title: 'Bydeler — Boligpuls Trondheim' }

export default async function BydelerPage() {
  const bydeler = await sanityClient.fetch<SanityBydel[]>(allBydelerQuery)

  const mapped = (bydeler || []).map((b) => ({
    id: b._id,
    slug: b.slug,
    name: b.name,
    color: b.color,
    emoji: b.emoji || '',
    created_at: '',
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
        Bydeler i Trondheim
      </h1>
      <p className="mb-8" style={{ color: '#5F7A7D' }}>
        Velg en bydel for å se artikler og oppdateringer om boligmarkedet.
      </p>
      <BydelerGrid bydeler={mapped} />
    </div>
  )
}
