import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { blogAPI } from '../services/api'

const CATEGORY_GRADIENTS = {
  '개발': 'from-slate-800 to-slate-900',
  'AI': 'from-zinc-800 to-neutral-900',
  '일상': 'from-stone-800 to-stone-900',
  '회고': 'from-neutral-800 to-zinc-900',
}

function getPlaceholderGradient(tags) {
  if (!tags) return 'from-ink-800 to-ink-900'
  const firstTag = tags.split(',')[0]?.trim()
  return CATEGORY_GRADIENTS[firstTag] || 'from-ink-800 to-ink-900'
}

export default function BlogList() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'all'

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 6

  useEffect(() => {
    setPage(1)
  }, [category])

  useEffect(() => {
    setLoading(true)
    const params = { page, page_size: pageSize }
    if (category !== 'all') {
      params.tag = category
    }
    blogAPI
      .getPosts(params)
      .then((res) => {
        setPosts(res.data.items)
        setTotal(res.data.total)
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [page, category])

  const totalPages = Math.ceil(total / pageSize)

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div>
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border-2 border-ink-200 border-t-ink-700 rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 text-ink-400">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-paper-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-ink-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0H9.75m0 0V18m-6-13.5V21a.75.75 0 00.75.75h10.5a.75.75 0 00.75-.75V6.108c0-.29-.168-.554-.432-.653a11.91 11.91 0 00-3.209-.508" />
            </svg>
          </div>
          <p className="text-base font-medium text-ink-500">아직 작성된 글이 없습니다</p>
          <p className="text-sm text-ink-300 mt-1">곧 새로운 글이 올라올 거예요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {posts.map((post) => (
            <article key={post.id} className="blog-card group">
              <Link to={`/${post.slug}`} className="block no-underline">
                <div className="aspect-[16/9] overflow-hidden relative">
                  {post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderGradient(post.tags)} flex items-center justify-center relative`}>
                      <span className="text-5xl font-bold text-white/10 select-none">
                        {post.title.charAt(0)}
                      </span>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.06),transparent_70%)]" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {post.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {post.tags
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <span key={tag} className="tag-chip">
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}
                  <h2 className="text-[1.05rem] font-bold text-ink-900 group-hover:text-ink-600 transition-colors duration-200 mb-2 line-clamp-2 leading-snug tracking-tight">
                    {post.title}
                  </h2>
                  {post.summary && (
                    <p className="text-ink-400 text-sm mb-3.5 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-ink-300">
                    <span className="font-medium">
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                    <span className="text-ink-200">&middot;</span>
                    <span>조회 {post.views}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-16">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-ink-400 hover:bg-paper-200 disabled:opacity-25 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                p === page
                  ? 'bg-ink-900 text-white shadow-sm'
                  : 'text-ink-400 hover:bg-paper-200 hover:text-ink-700'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-sm text-ink-400 hover:bg-paper-200 disabled:opacity-25 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
