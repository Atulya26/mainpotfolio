import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { PROJECTS } from '../lib/data.js'

const ITEMS = [
  { to: '/', label: 'Index', num: '00' },
  { to: '/', label: 'Selected', num: '01' },
  { to: '/archive', label: 'Archive', num: '02' },
  { to: '/published', label: 'Published', num: '03' },
  { to: '/about', label: 'About', num: '04' },
  { to: '/contact', label: 'Contact', num: '05' },
]

export default function MenuModal({ open, onClose }) {
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
            {ITEMS.map((it, i) => (
              <li key={it.label} className="menu__item">
                <div className="reveal menu__reveal">
                  <Link
                    to={it.to}
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
                {PROJECTS.slice(0, 4).map((p) => (
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
              <a href="mailto:hi@atulya.studio" data-cursor="link">hi@atulya.studio</a>
              <a href="#" data-cursor="link">LinkedIn ↗</a>
              <a href="#" data-cursor="link">Read.cv ↗</a>
              <a href="#" data-cursor="link">Are.na ↗</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
