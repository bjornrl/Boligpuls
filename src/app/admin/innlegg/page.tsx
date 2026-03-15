import Link from 'next/link'
import { sanityClient } from '@/sanity/client'
import { allPostsQuery } from '@/sanity/queries'
import type { SanityPost } from '@/sanity/types'
import { reportTypeConfig } from '@/sanity/types'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export const metadata = { title: 'Innlegg — Admin' }

export default async function AdminInnleggPage() {
  const posts = await sanityClient.fetch<SanityPost[]>(allPostsQuery)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-3xl"
          style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
        >
          Innlegg
        </h1>
        <Link
          href="/studio/structure/post"
          className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{ backgroundColor: '#D7B180', color: '#002D32' }}
        >
          Nytt innlegg i Studio
        </Link>
      </div>

      <div
        className="rounded-xl p-4 mb-6"
        style={{ backgroundColor: '#DEE5E7', border: '1px solid #D4DCDE' }}
      >
        <p className="text-sm" style={{ color: '#155356' }}>
          Innlegg redigeres nå i{' '}
          <Link href="/studio" className="font-medium underline">Sanity Studio</Link>.
          Her ser du en oversikt over publiserte innlegg.
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
      >
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#F8F7F5', borderBottom: '1px solid #E8ECEE' }}>
            <tr>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Tittel</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Type</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Periode</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: '#9BAFB2' }}>Dato</th>
              <th className="text-right px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => {
              const config = reportTypeConfig[post.reportType]
              return (
                <tr key={post._id} className="hover:bg-[#F8F7F5] transition-colors" style={{ borderBottom: '1px solid #E8ECEE' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#002D32' }}>
                    <Link href={`/post/${post.slug}`}>{post.title}</Link>
                  </td>
                  <td className="px-4 py-3">
                    {config && (
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${config.color}15`, color: config.color }}
                      >
                        {config.emoji} {config.label}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#5F7A7D' }}>
                    {post.reportPeriod || '—'}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#9BAFB2' }}>
                    {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right flex gap-2 justify-end">
                    {post.isNewsletter && (
                      <Link
                        href={`/admin/send/${post._id}`}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: '#DEE5E7', color: '#155356' }}
                      >
                        Send
                      </Link>
                    )}
                    <Link
                      href={`/studio/structure/post;${post._id}`}
                      className="text-xs font-medium"
                      style={{ color: '#155356' }}
                    >
                      Rediger i Studio
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!posts || posts.length === 0) && (
          <p className="text-center py-8" style={{ color: '#9BAFB2' }}>
            Ingen innlegg ennå. Opprett innlegg i <Link href="/studio" className="underline" style={{ color: '#155356' }}>Sanity Studio</Link>.
          </p>
        )}
      </div>
    </div>
  )
}
