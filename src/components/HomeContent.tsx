'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import PostCard from '@/components/PostCard'
import ReportTypeFilter from '@/components/ReportTypeFilter'
import { formatDate } from '@/lib/utils'
import type { SanityPost, SanityLocalReport, ReportType } from '@/sanity/types'

const LocalMarketMap = dynamic(() => import('@/components/LocalMarketMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl flex items-center justify-center"
      style={{ height: 480, backgroundColor: '#F5F3EF', border: '1px solid #EDEBE8' }}
    >
      <p style={{ color: '#9BAFB2' }}>Laster kart...</p>
    </div>
  ),
})

interface HomeContentProps {
  posts: SanityPost[]
  localReports: SanityLocalReport[]
}

export default function HomeContent({ posts, localReports }: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'local'>('reports')
  const [selectedType, setSelectedType] = useState<ReportType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = selectedType
    ? posts.filter((p) => p.reportType === selectedType)
    : posts

  const filteredLocal = useMemo(() => {
    if (!searchQuery) return localReports
    const q = searchQuery.toLowerCase()
    return localReports.filter(
      (report) =>
        report.title?.toLowerCase().includes(q) ||
        report.address?.toLowerCase().includes(q) ||
        report.excerpt?.toLowerCase().includes(q) ||
        report.searchTerms?.some((t) => t.toLowerCase().includes(q))
    )
  }, [localReports, searchQuery])

  return (
    <section className="max-w-[1120px] mx-auto px-4 py-12">
      {/* Tabs */}
      <div className="flex gap-1 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 rounded-xl text-sm transition-all duration-200 ${
            activeTab !== 'reports' ? 'hover:bg-[#EBE8E0] hover:text-[#57534E]' : ''
          }`}
          style={{
            fontWeight: activeTab === 'reports' ? 700 : 500,
            background: activeTab === 'reports' ? '#002D32' : '#F5F3EF',
            color: activeTab === 'reports' ? '#fff' : '#78716C',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Rapporter
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('local')}
          className={`px-6 py-3 rounded-xl text-sm transition-all duration-200 ${
            activeTab !== 'local' ? 'hover:bg-[#EBE8E0] hover:text-[#57534E]' : ''
          }`}
          style={{
            fontWeight: activeTab === 'local' ? 700 : 500,
            background: activeTab === 'local' ? '#002D32' : '#F5F3EF',
            color: activeTab === 'local' ? '#fff' : '#78716C',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Lokalmarkedet
        </button>
      </div>

      {/* Rapporter tab */}
      {activeTab === 'reports' && (
        <>
          <div className="mb-8">
            <ReportTypeFilter selected={selectedType} onChange={setSelectedType} />
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
              Ingen rapporter funnet.
            </p>
          )}
        </>
      )}

      {/* Lokalmarkedet tab */}
      {activeTab === 'local' && (
        <>
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søk etter adresse eller område..."
              className="w-full px-5 py-3.5 rounded-xl text-sm transition-colors"
              style={{
                border: '1.5px solid #D4DCDE',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                fontSize: 15,
              }}
              onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
              onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
            />
          </div>

          {/* Local report cards */}
          {filteredLocal.length > 0 ? (
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {filteredLocal.map((report) => (
                <LocalReportCard key={report._id} report={report} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
              {searchQuery ? 'Ingen lokalrapporter matcher søket.' : 'Ingen lokalrapporter publisert ennå.'}
            </p>
          )}

          {/* Map */}
          <LocalMarketMap
            reports={localReports}
            highlightedId={filteredLocal.length === 1 ? filteredLocal[0]._id : undefined}
          />
        </>
      )}
    </section>
  )
}

function LocalReportCard({ report }: { report: SanityLocalReport }) {
  return (
    <article
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
    >
      <div className="h-[3px]" style={{ backgroundColor: '#D7B180' }} />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full"
            style={{ backgroundColor: '#D7B18015', color: '#B8860B', border: '1px solid #D7B18030' }}
          >
            Lokalrapport
          </span>
          {report.publishedAt && (
            <span className="text-sm ml-auto" style={{ color: '#9BAFB2' }}>
              {formatDate(report.publishedAt)}
            </span>
          )}
        </div>
        <Link href={`/lokalmarkedet/${report.slug}`}>
          <h3
            className="text-lg mb-1 transition-colors"
            style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif', letterSpacing: '-0.01em' }}
          >
            {report.title}
          </h3>
        </Link>
        <p className="text-xs mb-2" style={{ color: '#9BAFB2' }}>
          {report.address}
        </p>
        {report.excerpt && (
          <p className="text-sm line-clamp-3 mb-4" style={{ color: '#5F7A7D' }}>
            {report.excerpt}
          </p>
        )}
        <Link
          href={`/lokalmarkedet/${report.slug}`}
          className="link-arrow inline-block text-sm font-medium opacity-90 hover:opacity-100"
          style={{ color: '#D7B180' }}
        >
          Les rapport &rarr;
        </Link>
      </div>
    </article>
  )
}
