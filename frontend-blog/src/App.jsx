import { Routes, Route, useLocation, Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import BlogEditor from './pages/BlogEditor'
import Login from './pages/Login'
import { CATEGORIES } from './constants/categories'
import { authAPI } from './services/api'
import WorkingPerson from './components/WorkingPerson'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/' || location.search.includes('category=')

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background 3D lines */}
      <div className="bg-lines" aria-hidden="true">
        <div className="bg-line bg-line-1" />
        <div className="bg-line bg-line-2" />
        <div className="bg-line bg-line-3" />
      </div>

      {isHome ? <HeroBanner /> : <SimpleHeader />}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/write" element={<BlogEditor />} />
          <Route path="/edit/:slug" element={<BlogEditor />} />
          <Route path="/:slug" element={<BlogDetail />} />
        </Routes>
      </main>
      <Footer />
      <WorkingPerson />
    </div>
  )
}

function HeroBanner() {
  const [searchParams] = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'
  const { user, handleLogout } = useAuth()

  return (
    <>
      {/* Sticky nav bar */}
      <header className="hero-header sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-white no-underline">
            Jion Blog
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            {user?.is_admin && (
              <Link to="/write" className="px-3 py-1.5 bg-white/15 text-white rounded-lg no-underline hover:bg-white/25 transition-colors">
                글쓰기
              </Link>
            )}
            {user && (
              <button onClick={handleLogout} className="text-white/50 hover:text-white/80 transition-colors">
                로그아웃
              </button>
            )}
            <a href="https://jionc.com" className="text-white/50 hover:text-white/80 no-underline transition-colors">
              Community
            </a>
          </nav>
        </div>
        {/* Category tabs in sticky header */}
        <div className="max-w-5xl mx-auto px-4 pb-2">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                to={cat.key === 'all' ? '/' : `/?category=${cat.key}`}
                className={`px-3 py-1.5 text-sm font-medium no-underline whitespace-nowrap rounded-lg transition-colors ${
                  currentCategory === cat.key
                    ? 'bg-white text-ink-900'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero intro section */}
      <section className="hero-section relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-lg md:text-xl text-white/60 max-w-lg">
            개발, AI, 그리고 일상에 대한 생각을 기록합니다.
          </p>
        </div>
      </section>
    </>
  )
}

function SimpleHeader() {
  const { user, handleLogout } = useAuth()

  return (
    <header className="border-b border-ink-100 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-ink-900 no-underline">
          Jion Blog
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {user?.is_admin && (
            <Link to="/write" className="px-3 py-1.5 bg-ink-800 text-white rounded-lg no-underline hover:bg-ink-900 transition-colors">
              글쓰기
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} className="text-ink-400 hover:text-ink-700 transition-colors">
              로그아웃
            </button>
          )}
          <a href="https://jionc.com" className="text-ink-500 hover:text-ink-800 no-underline transition-colors">
            Community
          </a>
        </nav>
      </div>
    </header>
  )
}

function useAuth() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    authAPI.getMe()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return { user, handleLogout }
}

export default App
