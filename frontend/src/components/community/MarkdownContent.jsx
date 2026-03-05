import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { defaultSchema } from 'hast-util-sanitize'

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: Array.from(new Set([...(defaultSchema.tagNames || []), 'img'])),
  attributes: {
    ...defaultSchema.attributes,
    img: Array.from(new Set([
      ...((defaultSchema.attributes && defaultSchema.attributes.img) || []),
      'src',
      'alt',
      'title',
      'loading',
    ])),
  },
  protocols: {
    ...defaultSchema.protocols,
    src: Array.from(new Set([
      ...((defaultSchema.protocols && defaultSchema.protocols.src) || []),
      'http',
      'https',
      'data',
      'blob',
    ])),
  },
}

const parseImageWidthFromTitle = (titleText = '') => {
  const normalized = String(titleText || '').trim()
  const match = normalized.match(/^w=(\d{2,4})$/i)
  if (!match) return null

  const widthValue = Number.parseInt(match[1], 10)
  if (!Number.isFinite(widthValue) || widthValue < 40 || widthValue > 4000) {
    return null
  }

  return widthValue
}

const markdownComponents = {
  h1: ({ node, ...props }) => (
    <h1 className="mb-4 text-2xl font-bold text-ink-950" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="mb-3 mt-6 text-xl font-semibold text-ink-900" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mb-3 mt-5 text-lg font-semibold text-ink-900" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-4 whitespace-pre-wrap text-ink-800 leading-relaxed last:mb-0" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="mb-4 list-disc pl-6 text-ink-800 leading-relaxed" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="mb-4 list-decimal pl-6 text-ink-800 leading-relaxed" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="mb-1" {...props} />
  ),
  a: ({ node, ...props }) => (
    <a
      className="font-medium text-ink-800 underline underline-offset-2 hover:text-ink-950"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  img: ({ node, alt, title, ...props }) => {
    const widthHint = parseImageWidthFromTitle(title)
    return (
      <img
        alt={alt || '첨부 이미지'}
        loading="lazy"
        title={widthHint ? undefined : title}
        style={widthHint ? { width: `${widthHint}px`, maxWidth: '100%', height: 'auto' } : undefined}
        className="my-4 w-full rounded-xl border border-ink-200 bg-paper-50 object-contain"
        {...props}
      />
    )
  },
  blockquote: ({ node, ...props }) => (
    <blockquote className="my-4 border-l-4 border-ink-200 pl-4 text-ink-600" {...props} />
  ),
  code: ({ node, inline, ...props }) => (
    inline
      ? <code className="rounded bg-paper-200 px-1.5 py-0.5 text-sm text-ink-900" {...props} />
      : <code className="text-sm text-ink-900" {...props} />
  ),
  pre: ({ node, ...props }) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-ink-200 bg-paper-50 p-4" {...props} />
  ),
}

function MarkdownContent({ source = '', className = '' }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, markdownSanitizeSchema]]}
        components={markdownComponents}
      >
        {String(source || '').replace(/\r\n/g, '\n')}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
