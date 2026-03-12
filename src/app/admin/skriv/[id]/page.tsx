'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { Bydel, Post } from '@/types/index'
import BydelSingleSelect from '@/components/BydelSingleSelect'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const [bydeler, setBydeler] = useState<Bydel[]>([])
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [bydelId, setBydelId] = useState('')
  const [isNewsletter, setIsNewsletter] = useState(true)
  const [isPublished, setIsPublished] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.from('bydeler').select('*').order('name').then(({ data }) => {
      if (data) setBydeler(data)
    })

    supabase.from('posts').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setPost(data)
        setTitle(data.title)
        setSlug(data.slug)
        setExcerpt(data.excerpt || '')
        setContent(data.content)
        setBydelId(data.bydel_id)
        setIsNewsletter(data.is_newsletter)
        setIsPublished(data.is_published)
      }
    })
  }, [id])

  useEffect(() => {
    if (!bydelId || !isNewsletter) {
      setSubscriberCount(null)
      return
    }
    const supabase = createClient()
    supabase
      .from('subscriber_bydeler')
      .select('subscriber_id, subscribers!inner(confirmed, is_active)', { count: 'exact', head: true })
      .eq('bydel_id', bydelId)
      .eq('subscribers.confirmed', true)
      .eq('subscribers.is_active', true)
      .then(({ count }) => setSubscriberCount(count || 0))
  }, [bydelId, isNewsletter])

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault()
    setLoading(true)

    const shouldPublish = publish !== undefined ? publish : isPublished

    const supabase = createClient()
    const { error } = await supabase
      .from('posts')
      .update({
        title,
        slug,
        excerpt,
        content,
        bydel_id: bydelId,
        is_newsletter: isNewsletter,
        is_published: shouldPublish,
        published_at: shouldPublish && !post?.published_at ? new Date().toISOString() : post?.published_at,
      })
      .eq('id', id)

    if (error) {
      alert('Feil: ' + error.message)
      setLoading(false)
      return
    }

    if (publish && isNewsletter) {
      router.push(`/admin/send/${id}`)
    } else {
      router.push('/admin/innlegg')
    }
    router.refresh()
  }

  const handleDelete = async () => {
    if (!confirm('Er du sikker på at du vil slette denne artikkelen?')) return

    const supabase = createClient()
    await supabase.from('posts').delete().eq('id', id)
    router.push('/admin/innlegg')
    router.refresh()
  }

  if (!post) {
    return <div className="py-12" style={{ color: '#A8A29E' }}>Laster...</div>
  }

  return (
    <div className="max-w-3xl">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: '#1C1917', fontFamily: 'var(--font-playfair)' }}
      >
        Rediger artikkel
      </h1>
      <form className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Tittel</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (slug === slugify(post.title)) setSlug(slugify(e.target.value))
            }}
            className="w-full px-4 py-2.5 rounded-xl text-sm"
            style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
            onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
          />
          <p className="text-xs mt-1" style={{ color: '#A8A29E' }}>Slug: {slug}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1C1917' }}>Bydel</label>
          <BydelSingleSelect bydeler={bydeler} selected={bydelId} onChange={setBydelId} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>Sammendrag</label>
          <textarea
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
            style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
            onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1C1917' }}>
            Innhold (Markdown)
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-mono resize-y"
            style={{ border: '1.5px solid #E7E5E4', outline: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = '#D4593A')}
            onBlur={(e) => (e.target.style.borderColor = '#E7E5E4')}
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewsletter}
              onChange={(e) => setIsNewsletter(e.target.checked)}
              style={{ accentColor: '#D4593A' }}
            />
            <span className="text-sm" style={{ color: '#1C1917' }}>Send som nyhetsbrev</span>
          </label>
          {isNewsletter && subscriberCount !== null && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F5F3EF', color: '#78716C' }}>
              {subscriberCount} mottakere
            </span>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => handleSubmit(e)}
            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            style={{ border: '1.5px solid #EDEBE8', color: '#1C1917' }}
          >
            Lagre
          </button>
          {!isPublished && (
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => handleSubmit(e, true)}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#D4593A' }}
            >
              Publiser
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="px-6 py-2.5 rounded-xl text-sm font-medium ml-auto transition-colors"
            style={{ color: '#D4593A', border: '1.5px solid #D4593A30' }}
          >
            Slett
          </button>
        </div>
      </form>
    </div>
  )
}
