import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blogAPI } from '../services/api'
import { CATEGORIES } from '../constants/categories'

const TAG_OPTIONS = CATEGORIES.filter((c) => c.key !== 'all')

export default function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    thumbnail_url: '',
    tags: '',
    is_published: true,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    blogAPI
      .getDrafts({ page: 1, page_size: 100 })
      .then((res) => {
        const post = res.data.items.find((p) => p.id === Number(id))
        if (post) {
          return blogAPI.getPost(post.slug)
        }
        throw new Error('not found')
      })
      .then((res) => {
        const p = res.data
        setForm({
          title: p.title || '',
          content: p.content || '',
          summary: p.summary || '',
          thumbnail_url: p.thumbnail_url || '',
          tags: p.tags || '',
          is_published: p.is_published ?? true,
        })
      })
      .catch(() => setError('글을 불러올 수 없습니다.'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const toggleTag = (tagKey) => {
    const currentTags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const newTags = currentTags.includes(tagKey)
      ? currentTags.filter((t) => t !== tagKey)
      : [...currentTags, tagKey]
    setForm((prev) => ({ ...prev, tags: newTags.join(', ') }))
  }

  const selectedTags = form.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (isEdit) {
        await blogAPI.update(id, form)
      } else {
        await blogAPI.create(form)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || '저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-ink-300 border-t-ink-800 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">
        {isEdit ? '글 수정' : '새 글 작성'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            제목
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-ink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            요약
          </label>
          <input
            name="summary"
            value={form.summary}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-ink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            썸네일 URL
          </label>
          <p className="text-xs text-ink-400 mb-1.5">
            블로그 목록에서 카드 이미지로 표시됩니다. 비워두면 글 제목 첫
            글자로 대체됩니다.
          </p>
          <input
            name="thumbnail_url"
            value={form.thumbnail_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-ink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {form.thumbnail_url && (
            <img
              src={form.thumbnail_url}
              alt="썸네일 미리보기"
              className="mt-2 h-32 object-cover rounded-lg border border-ink-100"
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag.key}
                type="button"
                onClick={() => toggleTag(tag.key)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  selectedTags.includes(tag.key)
                    ? 'bg-ink-800 text-white border-ink-800'
                    : 'bg-white text-ink-500 border-ink-200 hover:border-ink-400'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">
            내용 (Markdown)
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={20}
            className="w-full px-3 py-2 border border-ink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            checked={form.is_published}
            onChange={handleChange}
            id="is_published"
            className="w-4 h-4"
          />
          <label htmlFor="is_published" className="text-sm text-ink-700">
            바로 발행
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 bg-ink-800 text-white rounded-lg text-sm hover:bg-ink-900 disabled:opacity-50"
          >
            {saving ? '저장 중...' : isEdit ? '수정' : '발행'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2 border border-ink-200 text-ink-600 rounded-lg text-sm hover:bg-paper-100"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
