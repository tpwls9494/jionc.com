export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-ink-100 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink-700 tracking-tight">Jion Blog</p>
            <p className="text-xs text-ink-300 mt-0.5">개발, AI, 그리고 일상에 대한 기록.</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-400">
            <a
              href="https://jionc.com"
              className="hover:text-ink-700 no-underline transition-colors"
            >
              Community
            </a>
            <span className="text-ink-200" aria-hidden="true">|</span>
            <span className="text-ink-300">
              &copy; {new Date().getFullYear()} Jion
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
