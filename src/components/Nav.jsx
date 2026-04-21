import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MenuModal from './MenuModal.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function Nav({ theme, onToggleTheme }) {
  const { content } = useContent()
  const site = content.site
  const links = content.nav.links
  const hero = content.hero
  const projectsCount = content.projects.length
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState('')
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const opts = { hour: '2-digit', minute: '2-digit', timeZone: site.timezone || 'UTC', hour12: false }
      try {
        setTime(new Intl.DateTimeFormat('en-GB', opts).format(d))
      } catch {
        setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(d))
      }
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [site.timezone])

  return (
    <>
      <header className={`nav-v ${scrolled ? 'nav-v--scrolled' : ''}`}>
        <Link to="/" className="nav-v__brand" data-cursor="link" data-cursor-label="Home">
          <span>{site.name}</span>
          <span className="nav-v__brand-sep">·</span>
          <span className="nav-v__brand-role">{site.role}</span>
        </Link>

        <nav className="nav-v__links hide-mobile">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.path}
              end={l.path === '/'}
              className={({ isActive }) => `nav-v__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
              <span className="nav-v__count mono">({l.count})</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav-v__right">
          <span className="nav-v__status mono hide-mobile">
            <span className="nav-v__dot" aria-hidden />
            {hero.availabilityStatus || 'Available'}
          </span>
          <button
            className="nav-v__theme"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            data-cursor="button"
          >
            <span className={`nav-v__theme-dot ${theme === 'dark' ? 'is-dark' : ''}`} />
          </button>
          <button
            className="nav-v__menu"
            onClick={() => setOpen((v) => !v)}
            data-cursor="button"
            data-cursor-label={open ? 'Close' : 'Menu'}
          >
            <span className={`nav-v__menu-lines ${open ? 'is-open' : ''}`}>
              <i /><i />
            </span>
            <span className="mono">{open ? 'Close' : 'Menu'}</span>
          </button>
        </div>
      </header>
      <MenuModal key={location.pathname} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
