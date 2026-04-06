'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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

type TabId = 'reports' | 'local' | 'articles'

const tabs: { id: TabId; label: string; emoji: string }[] = [
  { id: 'reports', label: 'Rapporter', emoji: '📊' },
  { id: 'local', label: 'Lokalmarkedet', emoji: '📍' },
  { id: 'articles', label: 'Øvrige artikler', emoji: '📝' },
]

interface HomeContentProps {
  posts: SanityPost[]
  localReports: SanityLocalReport[]
}

function filterBySearch<T extends Record<string, unknown>>(items: T[], query: string): T[] {
  if (!query) return items
  const q = query.toLowerCase()
  return items.filter((item) =>
    (item.title as string)?.toLowerCase().includes(q) ||
    (item.excerpt as string)?.toLowerCase().includes(q) ||
    (item.reportPeriod as string)?.toLowerCase().includes(q) ||
    (item.address as string)?.toLowerCase().includes(q) ||
    (item.searchTerms as string[])?.some((t) => t.toLowerCase().includes(q))
  )
}

export default function HomeContent({ posts, localReports }: HomeContentProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabId>('reports')
  const [selectedType, setSelectedType] = useState<ReportType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'local') setActiveTab('local')
    else if (tab === 'articles') setActiveTab('articles')
  }, [searchParams])

  // Split posts into reports vs articles
  const reports = useMemo(() => posts.filter((p) => p.reportType !== 'artikkel'), [posts])
  const articles = useMemo(() => posts.filter((p) => p.reportType === 'artikkel'), [posts])

  // Apply search filtering
  const filteredReports = useMemo(() => {
    const searched = filterBySearch(reports, searchQuery)
    return selectedType ? searched.filter((p) => p.reportType === selectedType) : searched
  }, [reports, searchQuery, selectedType])

  const filteredArticles = useMemo(() => filterBySearch(articles, searchQuery), [articles, searchQuery])

  const filteredLocal = useMemo(() => filterBySearch(localReports, searchQuery), [localReports, searchQuery])

  return (
    <section className="max-w-[1120px] mx-auto px-4 py-12">
      {/* Global search bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Søk etter rapport, adresse eller tema..."
          className="w-full transition-colors"
          style={{
            padding: '14px 20px',
            fontSize: 15,
            border: '1px solid #D4DCDE',
            borderRadius: 10,
            background: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#D7B180')}
          onBlur={(e) => (e.target.style.borderColor = '#D4DCDE')}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8">
        {tabs.map((tab) => {
          const count = searchQuery
            ? tab.id === 'reports' ? filteredReports.length
            : tab.id === 'local' ? filteredLocal.length
            : filteredArticles.length
            : null

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-sm transition-all duration-200 ${
                activeTab !== tab.id ? 'hover:bg-[#EBE8E0] hover:text-[#57534E]' : ''
              }`}
              style={{
                fontWeight: activeTab === tab.id ? 700 : 500,
                background: activeTab === tab.id ? '#002D32' : '#F5F3EF',
                color: activeTab === tab.id ? '#fff' : '#78716C',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {tab.emoji} {tab.label}
              {count !== null && ` (${count})`}
            </button>
          )
        })}
      </div>

      {/* Rapporter tab */}
      {activeTab === 'reports' && (
        <>
          <div className="mb-8">
            <ReportTypeFilter selected={selectedType} onChange={setSelectedType} />
          </div>

          {filteredReports.length > 0 ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {filteredReports.map((post) => (
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

          <LocalMarketMap
            reports={localReports}
            highlightedId={filteredLocal.length === 1 ? filteredLocal[0]._id : undefined}
          />

          <div style={{ textAlign: 'center', padding: '32px 0', marginTop: 24 }}>
            <p style={{ fontSize: 15, color: '#5F7A7D', marginBottom: 16 }}>
              Finner du ikke området ditt?
            </p>
            <a
              href="/lokalrapport-foresporsel"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                borderRadius: 10,
                background: '#002D32',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Savner du et område? Spør oss her
            </a>
          </div>
        </>
      )}

      {/* Øvrige artikler tab */}
      {activeTab === 'articles' && (
        <>
          {filteredArticles.length > 0 ? (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {filteredArticles.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: '#9BAFB2' }}>
              {searchQuery ? 'Ingen artikler matcher søket.' : 'Ingen artikler publisert ennå.'}
            </p>
          )}
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
