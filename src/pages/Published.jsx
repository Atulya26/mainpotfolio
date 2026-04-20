import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Footer from '../components/Footer.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function Published() {
  const { content } = useContent()
  const pub = content.published
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pub__item', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        delay: 0.4,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="pub shell">
      <header className="pub__head">
        <span className="mono">{pub.eyebrow}</span>
        <h1 className="h2" style={{ whiteSpace: 'pre-line' }}>{pub.heading}</h1>
      </header>

      <ul className="pub__list">
        {pub.items.map((p, i) => (
          <li key={i} className="pub__item" data-cursor="link" data-cursor-label="Read">
            <a href="#" className="pub__link">
              <span className="mono pub__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="pub__body">
                <h3 className="pub__title">{p.t}</h3>
                <span className="mono pub__meta">
                  {p.where} · {p.y}
                </span>
              </div>
              <span className="pub__arrow">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  )
}
