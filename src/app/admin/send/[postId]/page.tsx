'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'
import { marked } from 'marked'
import { formatDate } from '@/lib/utils'
import BydelPill from '@/components/BydelPill'
import Link from 'next/link'

type PostWithBydel = {
  id: string
  title: string
  content: string
  excerpt: string
  published_at: string | null
  created_at: string
  bydel_id: string
  bydeler: { name: string; color: string; emoji: string }
}

export default function SendPage() {
  const { postId } = useParams<{ postId: string }>()
  const [post, setPost] = useState<PostWithBydel | null>(null)
  const [contentHtml, setContentHtml] = useState('')
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('posts')
      .select('*, bydeler(name, color, emoji)')
      .eq('id', postId)
      .single()
      .then(async ({ data }) => {
        if (data) {
          setPost(data as unknown as PostWithBydel)
          const html = await marked(data.content)
          setContentHtml(html)

          supabase
            .from('subscriber_bydeler')
            .select('subscriber_id, subscribers!inner(confirmed, is_active)', { count: 'exact', head: true })
            .eq('bydel_id', data.bydel_id)
            .eq('subscribers.confirmed', true)
            .eq('subscribers.is_active', true)
            .then(({ count }) => setSubscriberCount(count || 0))
        }
      })
  }, [postId])

  const handleSend = async () => {
    if (!confirm(`Vil du sende nyhetsbrevet til ${subscriberCount} abonnenter?`)) return
    setSending(true)

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })

      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        alert(data.error || 'Noe gikk galt')
      }
    } catch {
      alert('Kunne ikke sende nyhetsbrevet')
    } finally {
      setSending(false)
    }
  }

  if (!post) {
    return <div className="py-12" style={{ color: '#9BAFB2' }}>Laster...</div>
  }

  return (
    <div className="max-w-3xl">
      <h1
        className="text-3xl mb-6"
        style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
      >
        Send nyhetsbrev
      </h1>

      {result ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
        >
          <div className="text-5xl mb-4">&#9993;</div>
          <h2 className="text-xl mb-2" style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}>
            Nyhetsbrev sendt!
          </h2>
          <p style={{ color: '#5F7A7D' }}>
            <span style={{ color: '#155356', fontWeight: 600 }}>{result.sent}</span> sendt
            {result.failed > 0 && (
              <>, <span style={{ color: '#8B3A3A', fontWeight: 600 }}>{result.failed}</span> feilet</>
            )}
            {' '}av {result.total} totalt.
          </p>
          <Link
            href="/admin/innlegg"
            className="inline-block mt-6 text-sm font-medium"
            style={{ color: '#155356' }}
          >
            &larr; Tilbake til innlegg
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <BydelPill
              name={post.bydeler.name}
              emoji={post.bydeler.emoji}
              color={post.bydeler.color}
              size="md"
            />
            <span className="text-sm" style={{ color: '#5F7A7D' }}>
              {subscriberCount} mottakere
            </span>
          </div>

          {/* Preview */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECEE' }}
          >
            <div className="h-1.5" style={{ backgroundColor: post.bydeler.color }} />
            <div className="p-8">
              <p className="text-sm mb-2" style={{ color: '#9BAFB2' }}>
                {formatDate(post.published_at || post.created_at)}
              </p>
              <h2
                className="text-2xl mb-6"
                style={{ color: '#002D32', fontFamily: '"Basel Classic", Georgia, serif' }}
              >
                {post.title}
              </h2>
              <div
                className="prose max-w-none"
                style={{ lineHeight: '1.85' }}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={sending || subscriberCount === 0}
            className="w-full py-3 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#002D32' }}
          >
            {sending
              ? 'Sender...'
              : `Send til ${subscriberCount} abonnenter`}
          </button>
        </>
      )}
    </div>
  )
}
