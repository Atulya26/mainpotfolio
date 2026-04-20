import { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import PageTransition from './components/PageTransition.jsx'
import ThemeBridge from './components/ThemeBridge.jsx'
import Home from './pages/Home.jsx'
import Archive from './pages/Archive.jsx'
import Published from './pages/Published.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import CaseStudy from './pages/CaseStudy.jsx'
import { useLenis, getLenis } from './lib/useLenis.js'
import { ContentProvider } from './context/ContentContext.jsx'
import './styles/components.css'

const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

function SiteLayout() {
  return (
    <Routes>
      <Route element={<PageTransition />}>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/published" element={<Published />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
      </Route>
    </Routes>
  )
}

function PublicSite() {
  useLenis()
  const [loaded, setLoaded] = useState(false)
  const [theme, setTheme] = useState('light')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return
    loaded ? lenis.start() : lenis.stop()
  }, [loaded])

  useEffect(() => {
    const t = setTimeout(() => {
      import('gsap').then(({ default: gsap }) => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh()
        })
      })
    }, 50)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <>
      <ThemeBridge />
      <Preloader onDone={() => setLoaded(true)} />
      <Cursor />
      <Nav theme={theme} onToggleTheme={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} />
      <SiteLayout />
      <div className="grain" aria-hidden />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <ContentProvider>
      {isAdmin ? (
        <Suspense fallback={<div style={{ padding: 32, fontFamily: 'monospace' }}>Loading admin…</div>}>
          <AdminApp />
        </Suspense>
      ) : (
        <PublicSite />
      )}
    </ContentProvider>
  )
}
