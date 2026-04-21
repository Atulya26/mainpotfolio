import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MenuModal from './MenuModal.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function Nav({ theme, onToggleTheme }) {
  const { content } = useContent()
  const site = content.site
  const links = content.nav.links
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState('')
  const location = useLocation()

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
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <Link to="/" className="nav__brand" data-cursor="link" data-cursor-label="Home">
          <span className="nav__brand-mark">{site.brandMark}</span>
          <span className="nav__brand-name">{site.brandFull}</span>
        </Link>

        <nav className="nav__links hide-mobile">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.path}
              end={l.path === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              <span className="mono">{l.num}</span> {l.label}
              <span className="nav__count">{l.count}</span>
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          <span className="mono nav__time hide-mobile">{site.timezoneLabel} · {time}</span>
          <button
            className="nav__theme"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            data-cursor="button"
          >
            <span className={`nav__theme-dot ${theme === 'dark' ? 'is-dark' : ''}`} />
          </button>
          <button
            className="nav__menu"
            onClick={() => setOpen((v) => !v)}
            data-cursor="button"
            data-cursor-label={open ? 'Close' : 'Menu'}
          >
            <span className={`nav__menu-lines ${open ? 'is-open' : ''}`}>
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
