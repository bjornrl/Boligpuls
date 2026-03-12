'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import { Bydel } from '@/types/database'

export default function NewPostPage() {
  const [bydeler, setBydeler] = useState<Bydel[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [bydelId, setBydelId] = useState('')
  const [isNewsletter, setIsNewsletter] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.from('bydeler').select('*').order('name').then(({ data }) => {
      if (data) setBydeler(data)
    })
  }, [])

  useEffect(() => {
    setSlug(slugify(title))
  }, [title])

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('posts').insert({
      title,
      slug,
      excerpt,
      content,
      bydel_id: bydelId,
      is_newsletter: isNewsletter,
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    })

    if (error) {
      alert('Feil: ' + error.message)
      setLoading(false)
      return
    }

    router.push('/admin/posts')
    router.refresh()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ny artikkel</h1>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tittel</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bydel</label>
          <select
            required
            value={bydelId}
            onChange={(e) => setBydelId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Velg bydel...</option>
            {bydeler.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sammendrag</label>
          <textarea
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Innhold (Markdown)</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewsletter}
              onChange={(e) => setIsNewsletter(e.target.checked)}
              className="text-red-500 focus:ring-red-500 rounded"
            />
            <span className="text-sm text-gray-700">Send som nyhetsbrev</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => handleSubmit(e, false)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Lagre som utkast
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={(e) => handleSubmit(e, true)}
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
          >
            Publiser
          </button>
        </div>
      </form>
    </div>
  )
}
