import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import BlogEditor from './pages/BlogEditor'
import Login from './pages/Login'

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

      <Header />

      {/* Full-width hero on home page */}
      {isHome && (
        <section className="hero-section relative z-10">
          <div className="hero-content max-w-5xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Jion Blog
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-md">
              개발, AI, 그리고 일상에 대한 생각을 기록합니다.
            </p>
          </div>
        </section>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/write" element={<BlogEditor />} />
          <Route path="/edit/:id" element={<BlogEditor />} />
          <Route path="/:slug" element={<BlogDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
