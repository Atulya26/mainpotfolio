import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MenuModal from './MenuModal.jsx'

export default function Nav({ theme, onToggleTheme }) {
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
      const opts = { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen', hour12: false }
      setTime(new Intl.DateTimeFormat('en-GB', opts).format(d))
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <Link to="/" className="nav__brand" data-cursor="link" data-cursor-label="Home">
          <span className="nav__brand-mark">A.</span>
          <span className="nav__brand-name">Atulya Portfolio</span>
        </Link>

        <nav className="nav__links hide-mobile">
          <NavLink to="/" end className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
            <span className="mono">01</span> Selected
            <span className="nav__count">14</span>
          </NavLink>
          <NavLink to="/archive" className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
            <span className="mono">02</span> Archive
            <span className="nav__count">56</span>
          </NavLink>
          <NavLink to="/published" className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
            <span className="mono">03</span> Published
            <span className="nav__count">17</span>
          </NavLink>
        </nav>

        <div className="nav__right">
          <span className="mono nav__time hide-mobile">CPH · {time}</span>
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
      <MenuModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
