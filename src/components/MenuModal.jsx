import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useContent } from '../context/ContentContext.jsx'

export default function MenuModal({ open, onClose }) {
  const { content } = useContent()
  const items = content.nav.menuItems
  const featured = content.projects.slice(0, 4)
  const site = content.site
  const socials = site.socials
  const root = useRef(null)
  const itemsRef = useRef([])
  const panelRef = useRef(null)

  useEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(root.current, { pointerEvents: 'auto', autoAlpha: 1 })
        gsap.fromTo(
          panelRef.current,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' },
        )
        gsap.fromTo(
          itemsRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05, delay: 0.25 },
        )
      } else {
        gsap.to(panelRef.current, {
          clipPath: 'inset(100% 0 0 0)',
          duration: 0.6,
          ease: 'expo.inOut',
        })
        gsap.to(root.current, { autoAlpha: 0, pointerEvents: 'none', delay: 0.5, duration: 0 })
      }
    }, root)
    return () => ctx.revert()
  }, [open])

  return (
    <div ref={root} className="menu" style={{ opacity: 0, pointerEvents: 'none' }}>
      <div ref={panelRef} className="menu__panel">
        <div className="menu__inner">
          <ul className="menu__list">
            {items.map((it, i) => (
              <li key={it.label + i} className="menu__item">
                <div className="reveal menu__reveal">
                  <Link
                    to={it.path}
                    onClick={onClose}
                    ref={(el) => (itemsRef.current[i] = el)}
                    className="menu__link"
                    data-cursor="link"
                  >
                    <span className="mono">{it.num}</span>
                    <span className="menu__label">{it.label}</span>
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          <aside className="menu__aside">
            <div>
              <p className="eyebrow">Featured</p>
              <ul className="menu__featured">
                {featured.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/work/${p.slug}`} onClick={onClose} data-cursor="link" data-cursor-label={p.client}>
                      <span className="mono">{p.index}</span>
                      <span>{p.client}</span>
                      <span className="menu__feat-cat mono">{p.discipline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="menu__contact">
              <p className="eyebrow">Elsewhere</p>
              <a href={`mailto:${site.email}`} data-cursor="link">{site.email}</a>
              {socials.map((s) => (
                <a key={s.label} href={s.url} data-cursor="link">{s.label}</a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
